import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import Order from '~/models/order.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, HashAlgorithm, ReturnQueryFromVNPay } from 'vnpay'

// [GET] /checkout
export const index = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const cart = await Cart.findOne({
      _id: cartId
    })
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id
        const productInfo = await Product
          .findOne({ _id: productId })
          .select('title thumbnail slug price discountPercentage')

        productInfo['priceNew'] = productsHelper.priceNewProduct(
          productInfo as OneProduct
        )
        item['productInfo'] = productInfo
        item['totalPrice'] = productInfo['priceNew'] * item.quantity
      }
    }
    cart['totalsPrice'] = cart.products.reduce(
      (sum, item) => sum + item['totalPrice'],
      0
    )
    res.json({
      code: 200,
      message: 'Thành công!',
      cartDetail: cart
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /checkout/order
export const order = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const body = req.body
    const userInfo = {
      fullName: body.fullName,
      phone: body.phone, 
      address: body.address
    }
    const cart = await Cart.findOne({
      _id: cartId
    })

    const products = []
    for (const product of cart.products) {
      const objectProduct = {
        product_id: product.product_id,
        price: 0,
        quantity: product.quantity,
        discountPercentage: 0
      }

      const productInfo = await Product
        .findOne({ _id: product.product_id })
        .select('price discountPercentage title thumbnail')

      objectProduct.price = productInfo.price
      objectProduct.discountPercentage = productInfo.discountPercentage
      objectProduct['title'] = productInfo.title
      objectProduct['thumbnail'] = productInfo.thumbnail
      products.push(objectProduct)
    }
    const orderInfo = {
      user_id: req["accountUser"].id,
      cart_id: cartId,
      userInfo: userInfo,
      products: products,
      userId: req['accountUser'].id,
      amount: Math.floor(body.totalBill)
    }
    const order = new Order(orderInfo)
    await order.save()

    const vnpay = new VNPay({
      // ⚡ Cấu hình bắt buộc
      tmnCode: process.env.VNP_TMN_CODE,
      secureSecret: process.env.VNP_HASH_SECRET,
      vnpayHost: 'https://sanbox.vnpayment.vn',

      // 🔧 Cấu hình tùy chọn
      testMode: true, // Chế độ test
      hashAlgorithm: HashAlgorithm.SHA512, // Thuật toán mã hóa
      loggerFn: ignoreLogger // Custom logger
    })

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const vnpayResponse = vnpay.buildPaymentUrl({
      vnp_Amount: body.totalBill,
      vnp_IpAddr: '127.0.0.0.1', // ip test local
      vnp_TxnRef: order.id,
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: 'http://localhost:3100/checkout/check-payment-vnpay',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow)
    })

    for (const item of products) {
      await Product.updateOne(
        { _id: item.product_id },
        { $inc: { stock: -item.quantity } } // trừ số lượng
      )
    }
    await Cart.updateOne(
      {
        _id: cartId
      },
      {
        products: []
      }
    )
    res.json({
      code: 201,
      order: order,
      paymentUrl: vnpayResponse
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi tạo đơn hàng!',
      error: error
    })
  }
}

// [GET] /checkout/check-payment-vnpay
export const vnpayReturn = async (req: Request, res: Response) => {
  try {
    const vnpay = new VNPay({
      // ⚡ Cấu hình bắt buộc
      tmnCode: process.env.VNP_TMN_CODE,
      secureSecret: process.env.VNP_HASH_SECRET,
      vnpayHost: 'https://sanbox.vnpayment.vn',

      // 🔧 Cấu hình tùy chọn
      testMode: true, // Chế độ test
      hashAlgorithm: HashAlgorithm.SHA512, // Thuật toán mã hóa
      loggerFn: ignoreLogger // Custom logger
    })

    // Verify query từ VNPay
    const verified = vnpay.verifyReturnUrl(req.query as unknown as ReturnQueryFromVNPay)
    if (!verified.isVerified) {
      return res.status(400).json({ message: 'Sai chữ ký VNPay' })
    }

    const orderId = req.query["vnp_TxnRef"] as string
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }

    // Nếu thanh toán thành công
    if (req.query["vnp_ResponseCode"] === "00") {
      order.paymentInfo.status = 'PAID'
    } else {
      order.paymentInfo.status = 'FAILED'
    }
    order.paymentInfo.method = 'VNPAY'
    // Lưu thông tin giao dịch
    order.paymentInfo.details = {
      vnp_TxnRef: req.query.vnp_TxnRef,               // Mã đơn hàng của bạn (key liên kết để biết đơn nào đã thanh toán).
      vnp_TransactionNo: req.query.vnp_TransactionNo, // Mã giao dịch của VNPay (dùng để tra cứu với VNPay khi cần).
      vnp_BankCode: req.query.vnp_BankCode,           // Biết khách hàng dùng ngân hàng nào (tiện thống kê, hỗ trợ).
      vnp_BankTranNo: req.query.vnp_BankTranNo,       // Mã giao dịch ngân hàng
      vnp_CardType: req.query.vnp_CardType,
      vnp_PayDate: req.query.vnp_PayDate,             // Thời gian thanh toán (quan trọng cho báo cáo & tracking).
      vnp_ResponseCode: "00",                         // Trạng thái giao dịch ("00" = thành công).
    }
    await order.save()
    res.redirect(`http://localhost:5173/checkout/success/${order.id}`)
  } catch (err) {
    res.status(500).json({ message: "Lỗi xử lý callback VNPay", error: err });
  }
};

// [GET] /checkout/success/:orderId
export const success = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId
    })
    for (const product of order.products) {
      const productInfo = await Product
        .findOne({ _id: product.product_id })
        .select('title thumbnail')
      product['productInfo'] = productInfo
      product['priceNew'] = productsHelper.priceNewProduct(
        product as OneProduct
      )
      product['totalPrice'] = product['priceNew'] * product.quantity
    }
    order['totalsPrice'] = order.products.reduce(
      (sum, item) => sum + item['totalPrice'],
      0
    )
    res.json({
      code: 200,
      message: 'Đặt hàng thành công',
      order: order
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
