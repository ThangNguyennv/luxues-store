import { Request, Response } from 'express'
import filterOrderHelpers from '~/helpers/filterOrder'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import Order from '~/models/order.model'
import Account from '~/models/account.model'
import Product from '~/models/product.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import mongoose from 'mongoose'
import ExcelJS from 'exceljs'

// [GET] /admin/orders
export const index = async (req: Request, res: Response) => {
  try {
    const find: any = { }

    // if (req.query.status === 'CANCELED') {
    //   find.deleted = true
    // } else {
    //   find.deleted = false
    //   if (req.query.status) {
    //     find.status = req.query.status.toString()
    //   }
    // }

        
    find.deleted = false
    if (req.query.status) {
      find.status = req.query.status.toString()
    }
    
    // Search
    const objectSearch = searchHelpers(req.query)
    if (objectSearch.keyword) {
      find._id = new mongoose.Types.ObjectId(objectSearch.keyword)
    }
    // End search

    // Pagination
    const countOrders = await Order.countDocuments(find)
    const objectPagination = paginationHelpers(
      {
        currentPage: 1,
        limitItems: 15
      },
      req.query,
      countOrders
    )
    // End Pagination

    // Sort
    let sort: Record<string, any> = {}
    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toLocaleString()
      sort[sortKey] = req.query.sortValue
    } else {
      sort['position'] = 'desc'
    }
    // End Sort

    const orders = await Order
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)

    for (const order of orders) {
      // Lấy ra thông tin người tạo
      const user = await Account.findOne({
        _id: order.createdBy.account_id
      })
      if (user) {
        order['accountFullName'] = user.fullName
      }
      // Lấy ra thông tin người cập nhật gần nhất
      const updatedBy = order.updatedBy[order.updatedBy.length - 1]
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id
        })
        updatedBy['accountFullName'] = userUpdated.fullName
      }
      if (order.products.length > 0) {
        for (const item of order.products) {
          const productId = item.product_id
          const productInfo: OneProduct = await Product.findOne({
            _id: productId
          }).select('price discountPercentage')
          productInfo.priceNew = productsHelper.priceNewProduct(productInfo)
          item['productInfo'] = productInfo
          item['totalPrice'] = productInfo.priceNew * item.quantity
        }
      }
      order['totalsPrice'] = order.products.reduce(
        (sum, item) => sum + item['totalPrice'],
        0
      )
      order['price'] = order['totalsPrice']
    }
    // Sort chay do không sài hàm sort() kia cho các thuộc tính không có trong db.
    if (req.query.sortKey === 'price' && req.query.sortValue) {
      const dir = req.query.sortValue === 'desc' ? -1 : 1
      orders.sort((a, b) => dir * (a['price'] - b['price']))
    }
    
    const accounts = await Account.find({
      deleted: false
    })
    const allOrders = await Order.find({
      deleted: false
    })
  
    res.json({
      code: 200,
      message: 'Thành công!',
      orders: orders,
      filterOrder: filterOrderHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
      accounts: accounts,
      allOrders: allOrders,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status
    const id = req.params.id

    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await Order.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy }
      }
    )
    res.json({
      code: 200,
      message: 'Cập nhật trạng thái thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    enum Key {
      PENDING = 'PENDING',
      CONFIRMED = 'CONFIRMED',
      TRANSPORTING = 'TRANSPORTING',
      CANCELED = 'CANCELED',
      DELETEALL = 'DELETEALL',
    }
    switch (type) {
      case Key.PENDING:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.PENDING, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.TRANSPORTING:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.TRANSPORTING, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.CONFIRMED:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.CONFIRMED, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.CANCELED:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.CANCELED, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.DELETEALL:
        await Order.updateMany(
          { _id: { $in: ids } },
          { deleted: 'true', deletedAt: new Date() }
        )
        res.json({
          code: 204,
          message: `Đã hủy thành công ${ids.length} đơn hàng!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại!'
        })
        break
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [DELETE] /admin/orders/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    await Order.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: req['accountAdmin'].id,
          deletedAt: new Date()
        }
      }
    )
    res.json({
      code: 204,
      message: 'Đã xóa thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [DELETE] /admin/orders/permanentlyDelete/:id
export const permanentlyDeleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    await Order.deleteOne(
      { _id: id }
    )
    res.json({
      code: 204,
      message: 'Đã xóa vĩnh viễn thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/orders/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const findDeleted = {
      deleted: true,
      _id: req.params.id
    }
    const order = await Order.findOne(find)
    const orderDeleted = await Order.findOne(findDeleted)

    if (order) {
      res.json({
        code: 200,
        message: 'Chi tiết đơn hàng!',
        order: order
      })
    }
    if (orderDeleted) {
      res.json({
        code: 200,
        message: 'Chi tiết đơn hàng bị xóa!',
        orderDeleted: orderDeleted
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/recover/:id
export const recoverPatch = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    await Order.updateOne(
      { _id: id },
      { deleted: false, recoveredAt: new Date() }
    )
    res.json({
      code: 200,
      message: 'Đã khôi phục thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/edit-estimatedDeliveryDay
export const estimatedDeliveryDay = async (req: Request, res: Response) => {
  try {
    const estimatedDeliveryDay = req.body.estimatedDeliveryDay
    const orderId = req.body.id
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await Order.updateOne(
      { _id: orderId },
      { estimatedDeliveryDay: estimatedDeliveryDay, $push: { updatedBy: updatedBy }}
    )
    res.json({
      code: 200,
      message: `Cập nhật thành công thời gian giao hàng!`
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/edit-estimatedConfirmedDay
export const estimatedConfirmedDay = async (req: Request, res: Response) => {
  try {
    const estimatedConfirmedDay = req.body.estimatedConfirmedDay
    const orderId = req.body.id
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await Order.updateOne(
      { _id: orderId },
      { estimatedConfirmedDay: estimatedConfirmedDay, $push: { updatedBy: updatedBy }}
    )
    res.json({
      code: 200,
      message: `Cập nhật thành công thời gian nhận hàng!`
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/orders/export
export const exportOrder = async (req: Request, res: Response) => {
  try {
    const find: any = { deleted: false }
    const status = req.query.status as string

    if (status) {
      find.status = status
    }

    // Lấy TẤT CẢ đơn hàng (không phân trang) khớp với bộ lọc
    const orders = await Order.find(find).sort({ createdAt: -1 })

    // Tạo file Excel
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Đơn hàng ${status || 'Tất cả'}`)

    // Định nghĩa các cột
    worksheet.columns = [
      { header: 'Mã Đơn Hàng', key: 'orderId', width: 30 },
      { header: 'Ngày Đặt', key: 'createdAt', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm:ss' } },
      { header: 'Tên Khách Hàng', key: 'customerName', width: 30 },
      { header: 'Số Điện Thoại', key: 'phone', width: 20 },
      { header: 'Địa Chỉ', key: 'address', width: 50 },
      { header: 'Trạng Thái Đơn', key: 'orderStatus', width: 20 },
      { header: 'Sản Phẩm', key: 'productTitle', width: 40 },
      { header: 'Phân Loại (Màu)', key: 'color', width: 15 },
      { header: 'Phân Loại (Size)', key: 'size', width: 15 },
      { header: 'Số Lượng', key: 'quantity', width: 10 },
      { header: 'Đơn Giá (Đã giảm)', key: 'price', width: 20, style: { numFmt: '#,##0"đ"' } },
      { header: 'Thành Tiền', key: 'total', width: 20, style: { numFmt: '#,##0"đ"' } },
      { header: 'PT Thanh Toán', key: 'paymentMethod', width: 15 },
      { header: 'TT Thanh Toán', key: 'paymentStatus', width: 15 },
      { header: 'Ghi Chú', key: 'note', width: 30 }
    ]

    // Làm cho hàng tiêu đề in đậm
    worksheet.getRow(1).font = { bold: true }

    // Thêm dữ liệu vào file
    for (const order of orders) {
      for (const product of order.products) {
        const priceNew = Math.floor(product.price * (100 - product.discountPercentage) / 100)
        
        worksheet.addRow({
          orderId: order._id.toString(),
          createdAt: order.createdAt,
          customerName: order.userInfo.fullName,
          phone: order.userInfo.phone,
          address: order.userInfo.address,
          orderStatus: order.status,
          productTitle: product.title,
          color: product.color, 
          size: product.size,  
          quantity: product.quantity,
          price: priceNew,
          total: priceNew * product.quantity,
          paymentMethod: order.paymentInfo.method,
          paymentStatus: order.paymentInfo.status,
          note: order.note
        })
      }
    }

    // Gửi file về cho client
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="don-hang-${status || 'all'}-${new Date().getTime()}.xlsx`
    )

    // Ghi workbook vào response
    await workbook.xlsx.write(res)
    res.end()

  } catch (error) {
    console.error("Lỗi khi xuất Excel:", error)
    res.status(500).json({ 
      code: 500, 
      message: "Lỗi máy chủ khi xuất file", 
      error: error.message 
    })
  }
}