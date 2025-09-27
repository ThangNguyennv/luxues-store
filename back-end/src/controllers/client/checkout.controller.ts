import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import Order from '~/models/order.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { ReturnQueryFromVNPay } from 'vnpay'
import axios from 'axios'
import crypto from 'crypto'
import { vnpayMethod } from '~/helpers/vnpayPayment'
import { zaloMethod } from '~/helpers/zalopayPayment'
import { vnpayCreate } from '~/helpers/vnpayPayment'
import "~/cron/order.cron" // ⚡ load cron khi server start
import qs from "qs"

// [GET] /checkout
export const index = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const cart = await Cart.findOne({ _id: cartId })
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
    cart['totalsPrice'] = cart.products.reduce((sum, item) => sum + item['totalPrice'], 0)
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
    const { note, paymentMethod, fullName, phone, address } = req.body
    const userInfo = {
      fullName: fullName,
      phone: phone, 
      address: address
    }
    const cart = await Cart.findOne({ _id: cartId })
    if (cart) {
      if (cart.products.length > 0) {
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
        const totalBill = products.reduce((acc, product) => {
          const priceNewForOneProduct = (product.price * (100 - product.discountPercentage)) / 100
          return acc + priceNewForOneProduct * product.quantity
        }, 0)
        const orderInfo = {
          user_id: req["accountUser"].id,
          cart_id: cartId,
          userInfo: userInfo,
          products: products,
          userId: req['accountUser'].id,
          amount: Math.floor(totalBill),
          note: note
        }
        const order = new Order(orderInfo)
        order.paymentInfo.method = paymentMethod
        await order.save()

        if (paymentMethod === 'COD') {
          res.json({ 
            code: 201,  
            message: 'Thành công!', 
            order: order
          })
          await Cart.updateOne(
            { _id: cartId },
            { products: [] }
          )
          await order.save()
        } else if (paymentMethod === 'VNPAY') {
          vnpayMethod(totalBill, order.id, res)
        } else if (paymentMethod === 'ZALOPAY') {
          zaloMethod(totalBill, products, order.userInfo.phone, order.id, res)
        } else if (paymentMethod === 'MOMO') {

        }
        for (const item of products) {
          await Product.updateOne(
            { _id: item.product_id },
            { $inc: { stock: -item.quantity } } // trừ số lượng
          )
        }
      } 
    } 
  } catch (error) {
    res.json({ 
      code: 400,  
      message: 'Lỗi!', 
      error: error
    })
  } 
}

// [POST] /checkout/callback
export const callback = async (req: Request, res: Response) => {
  try {
    let { data, mac } = req.body
    const macVerify = crypto.createHmac("sha256", process.env.ZALOPAY_KEY2)
      .update(data)
      .digest("hex")
    
    if (macVerify !== mac) {
      return res.json({ return_code: -1, return_message: "mac not match" }) // Báo lỗi, thường khi MAC không khớp (nghi ngờ giả mạo).
    }
    let dataJson = JSON.parse(data)
    const [phone, id] = dataJson.app_user.split("-");
    const order = await Order.findOne({
      _id: id,
      'userInfo.phone': phone,
      deleted: false,
    })
    if (!order) {
      return res.json({ return_code: 0, return_message: 'order not found' })
    }
    const result = await queryOrder(req, dataJson.app_trans_id)
    console.log("🚀 ~ checkout.controller.ts ~ callback ~ result:", result);
    if (result.status === "PAID") {
      console.log("Vào đây")
      await Cart.updateOne(
        { _id: order.cart_id },
        { products: [] }
      )
      order.paymentInfo.status = "PAID"
      order.paymentInfo.details = {
      app_trans_id: dataJson.app_trans_id,
      app_time: dataJson.app_time,
      amount: dataJson.amount,
    }
    } else if (result.status === "PENDING") {
      order.paymentInfo.status = "PENDING"
    } else if (result.status === "FAILED") {
      order.paymentInfo.status = "FAILED"
      order.paymentInfo.details = {
        embed_data: `http://localhost:5173/cart`,
      }
    }
    await order.save()
    return res.json({ return_code: 1, return_message: "success" }) // Báo cho ZaloPay biết bạn đã nhận callback thành công.
  } catch (error) {
    return res.json({ return_code: 0, return_message: 'retry', error }) // Báo cho ZaloPay retry lại callback (ví dụ server bạn đang lỗi DB).
  }
}

// [POST] /checkout/order-status
export const queryOrder  = async (req: Request , app_trans_id: string) => {
  const key1 = process.env.ZALOPAY_KEY1
  const app_id = process.env.ZALOPAY_APP_ID
  
  const data = `${app_id}|${app_trans_id}|${key1}`
  const mac = crypto.createHmac("sha256", key1)
    .update(data)
    .digest("hex")
  const payload = {
    app_id,
    app_trans_id,
    mac
  }
  const response = await axios.post(
    process.env.ZALOPAY_ENDPOINT_QUERY,
    qs.stringify(payload), // convert sang form-urlencoded
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  )
  console.log("🚀 ~ checkout.controller.ts ~ queryOrder ~ response:", response);
  if (response.data.return_code !== 1) {
    // API gọi thất bại -> sai request
    return { status: "ERROR", data: response };
  }
   // return_code = 1 => API query thành công, check sub_return_code
  switch (response.data.sub_return_code) {
    case 1:
      return { status: "PAID", data: response }
    case 2:
      return { status: "FAILED", data: response }
    default:
      return { status: "PENDING", data: response }
  }
}

// [GET] /checkout/check-payment-vnpay
export const vnpayReturn = async (req: Request, res: Response) => {
  console.log("VNPay Return gọi về:", req.query)
  try {
    const cartId = req["cartId"]
    // Verify query từ VNPay
    const verified = vnpayCreate.verifyReturnUrl(req.query as unknown as ReturnQueryFromVNPay)
    if (!verified.isVerified) {
      return res.json({ 
        code: 400,  
        message: 'Sai chữ ký VNPay'
      })
    }

    const orderId = req.query["vnp_TxnRef"] as string
    const order = await Order.findById(orderId)

    if (!order) {
      return res.json({ 
        code: 404,  
        message: 'Không tìm thấy đơn hàng'
      })
    }
    const { vnp_TxnRef, vnp_TransactionNo, vnp_BankCode, vnp_BankTranNo, vnp_CardType, vnp_PayDate } = req.query
    // Nếu thanh toán thành công
    if (req.query["vnp_ResponseCode"] === "00" && req.query["vnp_TransactionStatus"] === "00") {
      order.paymentInfo.status = 'PAID'
      // Lưu thông tin giao dịch
      order.paymentInfo.details = {
        vnp_TxnRef: vnp_TxnRef,               // Mã đơn hàng của bạn (key liên kết để biết đơn nào đã thanh toán).
        vnp_TransactionNo: vnp_TransactionNo, // Mã giao dịch của VNPay (dùng để tra cứu với VNPay khi cần).
        vnp_BankCode: vnp_BankCode,           // Biết khách hàng dùng ngân hàng nào (tiện thống kê, hỗ trợ).
        vnp_BankTranNo: vnp_BankTranNo,       // Mã giao dịch ngân hàng
        vnp_CardType: vnp_CardType,
        vnp_PayDate: vnp_PayDate,             // Thời gian thanh toán (quan trọng cho báo cáo & tracking).
        vnp_ResponseCode: "00",               // Trạng thái giao dịch ("00" = thành công).
      }
      await Cart.updateOne(
        { _id: cartId },
        { products: [] }
      )
      res.redirect(`http://localhost:5173/checkout/success/${order.id}`)
    } else if (req.query["vnp_ResponseCode"] === "24" && req.query["vnp_TransactionStatus"] === "02") {
      order.paymentInfo.status = 'FAILED'
      res.redirect('http://localhost:5173/cart')
    }
    await order.save()
  } catch (error) {
    res.json({ 
      code: 500,  
      message: "Lỗi xử lý callback VNPay",
      error: error
    })
  }
}

// [GET] /checkout/vnpay-ipn
export const vnpayIpn = async (req: Request, res: Response) => {
  try {
    console.log("VNPay IPN gọi về:", req.query)
    // Verify query từ VNPay
    const verified = vnpayCreate.verifyIpnCall(req.query as unknown as ReturnQueryFromVNPay)
    if (!verified.isVerified) {
      return res.json({ 
        RspCode: "97",  
        Message: 'Sai chữ ký VNPay'
      })
    }

    const orderId = req.query["vnp_TxnRef"] as string
    const order = await Order.findById(orderId)

    if (!order) {
      return res.json({ 
        RspCode: "01",  
        Message: 'Không tìm thấy đơn hàng!'
      })
    }
    const { vnp_TxnRef, vnp_TransactionNo, vnp_BankCode, vnp_BankTranNo, vnp_CardType, vnp_PayDate } = req.query
    // Nếu thanh toán thành công
    if (req.query["vnp_ResponseCode"] === "00") {
      order.paymentInfo.status = 'PAID'
      // Lưu thông tin giao dịch
      order.paymentInfo.details = {
        vnp_TxnRef: vnp_TxnRef,               // Mã đơn hàng của bạn (key liên kết để biết đơn nào đã thanh toán).
        vnp_TransactionNo: vnp_TransactionNo, // Mã giao dịch của VNPay (dùng để tra cứu với VNPay khi cần).
        vnp_BankCode: vnp_BankCode,           // Biết khách hàng dùng ngân hàng nào (tiện thống kê, hỗ trợ).
        vnp_BankTranNo: vnp_BankTranNo,       // Mã giao dịch ngân hàng
        vnp_CardType: vnp_CardType,
        vnp_PayDate: vnp_PayDate,             // Thời gian thanh toán (quan trọng cho báo cáo & tracking).
        vnp_ResponseCode: "00",               // Trạng thái giao dịch ("00" = thành công).
      }
    }
    await order.save()
    return res.json({ RspCode: "00", Message: "Thành công!" })
  } catch (error) {
    return res.json({ RspCode: "99", Message: "Lỗi không xác định!" })
  }
}


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
