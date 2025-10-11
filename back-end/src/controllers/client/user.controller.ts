import { Request, Response } from 'express'
import User from '~/models/user.model'
import ForgotPassword from '~/models/forgot-password.model'
import Cart from '~/models/cart.model'
import md5 from 'md5'
import * as generateHelper from '~/helpers/generate'
import * as sendMailHelper from '~/helpers/sendMail'
import filterOrderHelpers from '~/helpers/filterOrder'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import Order from '~/models/order.model'
import Account from '~/models/account.model'
import Product from '~/models/product.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import mongoose from 'mongoose'

// [POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const { fullName, email } = req.body
    const isFullName = await User.findOne({
      fullName: fullName
    })
    if (isFullName) {
      res.json({
        code: 401,
        message: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!'
      })
      return
    }
    const isExistEmail = await User.findOne({
      email: email
    })
    if (isExistEmail) {
      res.json({
        code: 401,
        message: 'Email đã tồn tại, vui lòng chọn email khác!'
      })
      return
    }
    req.body.password = md5(req.body.password)
    req.body.confirmPassword = md5(req.body.confirmPassword)
    const user = new User(req.body)
    await user.save()
    res.json({
      code: 200,
      message: 'Đăng ký tài khoản thành công, mời bạn đăng nhập lại để tiếp tục!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error,
    })
  }
}

// [POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      email: email,
      deleted: false
    })
    if (!user) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }
    if (md5(password) !== user.password) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }
    if (user.status === 'inactive') {
      res.json({
        code: 403,
        message: 'Tài khoản đang bị khóa!'
      })
      return
    }
    const cart = await Cart.findOne({
      user_id: user._id
    })
    if (cart) {
      res.cookie('cartId', cart._id)
    } else {
      await Cart.updateOne(
        {
          _id: req.cookies.cartId
        },
        {
          user_id: user._id
        }
      )
    }
    res.cookie('tokenUser', user.tokenUser, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    })
    res.json({
      code: 200,
      message: 'Đăng nhập thành công!',
      tokenUser: user.tokenUser
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /user/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('tokenUser')
    res.clearCookie('cartId')
    res.json({
      code: 200,
      message: 'Đăng xuất thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email
    const user = await User.findOne({
      email: email,
      deleted: false
    })
    if (!user) {
      res.json({
        code: 401,
        message: 'Email không tồn tại!'
      })
      return
    }

    // Lưu thông tin vào db
    const otp = generateHelper.generateRandomNumber(6)
    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now()
    }
    const record = await ForgotPassword.findOne({
      email: email
    })
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    // Tránh trường hợp gửi otp liên tục mà phải hết hạn otp đó thì mới gửi otp khác.
    if (!record) {
      res.json({
        code: 200,
        message:
          'Mã OTP đã được gửi qua email của bạn, vui lòng kiểm tra email!'
      })
      await forgotPassword.save()
    }
    // Nếu tồn tại email thì gửi mã OTP qua email
    const subject = 'Mã OTP xác minh lấy lại mật khẩu'
    const html = `
      Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 2 phút.
    `
    sendMailHelper.sendMail(email, subject, html)
  } catch (error) {
   res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /user/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email
    const otp = req.body.otp
    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp
    })
    if (!result) {
      res.json({
        code: 401,
        message: 'OTP không hợp lệ!'
      })
      return
    }
    const user = await User.findOne({
      email: email
    })
    res.cookie('tokenUser', user.tokenUser)
    res.json({
      code: 200,
      message: 'Mã OTP hợp lệ!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
    await User.updateOne(
      {
        tokenUser: tokenUser
      },
      {
        password: md5(password)
      }
    )
    res.json({
      code: 200,
      message: 'Đổi mật khẩu thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /user/info
export const info = async (req: Request, res: Response) => {
  try {
    const tokenUser = req.cookies.tokenUser
    const accountUser = await User.findOne({
      tokenUser: tokenUser,
      deleted: false
    })
    res.json({
      code: 200,
      message: 'Thông tin tài khoản!',
      accountUser: accountUser
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /user/info/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const isEmailExist = await User.findOne({
      _id: { $ne: req['accountUser'].id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: req.body.email,
      deleted: false
    })
    if (isEmailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`
      })
    } else {
      await User.updateOne({ _id: req['accountUser'].id }, req.body)
      res.json({
        code: 200,
        message: 'Đã cập nhật thành công tài khoản!'
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

// [PATCH] /user/info/edit/change-password
export const changePasswordPatch = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      _id: req['accountUser'].id,
      deleted: false
    })
    if (user) {
      if (md5(req.body.currentPassword) != user.password) {
        res.json({
          code: 400,
          message: 'Mật khẩu hiện tại không chính xác, vui lòng nhập lại!'
        })
        return
      }
      if (req.body.password) {
        req.body.password = md5(req.body.password) // Mã hóa password mới để lưu lại vào db
      } else {
        delete req.body.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
      }
      await User.updateOne({ email: req['accountUser'].email }, req.body)
      res.json({
        code: 200,
        message: 'Đã đổi mật khẩu tài khoản thành công!'
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

// [GET] /user/my-orders
export const getOrders = async (req: Request, res: Response) => {
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
  
    res.json({
      code: 200,
      message: 'Thành công!',
      orders: orders,
      filterOrder: filterOrderHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /user/my-orders/cancel-order/:id
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id
    await Order.updateOne(
      { _id: orderId },
      { status: 'CANCELED' }
    )
    res.json({
      code: 200,
      message: 'Hủy thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}