import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import Order from '~/models/order.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, HashAlgorithm, ReturnQueryFromVNPay } from 'vnpay'
import moment from 'moment'
import axios from 'axios'
import { createHmac } from 'crypto';
import crypto from 'crypto'

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
  console.log(req.body)
  try {
    console.log(123)
    const cartId = req["cartId"]
    const { orderId, note, paymentMethod, fullName, phone, address } = req.body
    const userInfo = {
      fullName: fullName,
      phone: phone, 
      address: address
    }
    const cart = await Cart.findOne({ _id: cartId })
    if (cart) {
      console.log("vào cart")
      if (cart.products.length === 0) {
        console.log("vào cart rỗng")
        const orderUnPaid = await Order.findOne({
          _id: orderId,
          cart_id: cartId,
          'paymentInfo.status': 'PENDING',
          deleted: false
        })
        if (orderUnPaid) {
          console.log("vào orderUnPaid")
          const totalBill = orderUnPaid.products.reduce((acc, product) => {
            const priceNewForOneProduct = (product.price * (100 - product.discountPercentage)) / 100
            return acc + priceNewForOneProduct * product.quantity
          }, 0)
          orderUnPaid.paymentInfo.method = paymentMethod
          await orderUnPaid.save()
          if (paymentMethod === 'VNPAY') {
            console.log("vào VNPAY")
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
              vnp_Amount: totalBill,
              vnp_IpAddr: '127.0.0.0.1', // ip test local
              vnp_TxnRef: orderUnPaid.id,
              vnp_OrderInfo: `Thanh toan don hang ${orderUnPaid.id}`,
              vnp_OrderType: ProductCode.Other,
              vnp_ReturnUrl: 'http://localhost:3100/checkout/check-payment-vnpay',
              vnp_Locale: VnpLocale.VN,
              vnp_CreateDate: dateFormat(new Date()),
              vnp_ExpireDate: dateFormat(tomorrow)
            })
            res.json({ 
              code: 201,  
              message: 'Thành công!', 
              paymentUrl: vnpayResponse
            })
          } else if (paymentMethod === 'ZALOPAY') {
            const embed_data = {
              redirecturl: `http://localhost:5173/checkout/success/${orderUnPaid.id}`
            }
            const items = orderUnPaid.products.map(p => ({
              itemid: p.product_id,
              itemname: p.title,
              itemprice: Math.floor(p.price * (100 - p.discountPercentage) / 100),
              itemquantity: p.quantity
            }))
            const transID = Math.floor(Math.random() * 1000000)
            const orderInfo = {
              app_id: process.env.ZALOPAY_APP_ID, // Định danh cho ứng dụng đã được cấp bởi ZaloPay.
              app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // mã giao dich có định dạng yyMMdd_xxxx
              app_user: `${orderUnPaid.userInfo.phone}-${orderUnPaid.id}`, // Thông tin người dùng như: id/username/tên/số điện thoại/email của user.
              app_time: Date.now(), // Thời gian tạo đơn hàng (unix timestamp in milisecond). Thời gian tính đến milisecond, lấy theo current time và không quá 15 phút so với thời điểm thanh toán
              item: JSON.stringify(items), // 	Dữ liệu riêng của đơn hàng. Dữ liệu này sẽ được callback lại cho AppServer khi thanh toán thành công (Nếu không có thì để chuỗi rỗng). Dạng [{...}]
              embed_data: JSON.stringify(embed_data), 
              amount: Math.floor(totalBill), 
              description: `Thanh toán đơn hàng ${transID}`,
              bank_code: "", 
              mac: '',
              callback_url: 'https://164896da51bb.ngrok-free.app/checkout/callback'
            }

            const data = [
              orderInfo.app_id,
              orderInfo.app_trans_id,
              orderInfo.app_user,
              orderInfo.amount,
              orderInfo.app_time,
              orderInfo.embed_data,
              orderInfo.item
            ].join('|');

            orderInfo.mac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY1)
              .update(data)
              .digest('hex')
            console.log("🚀 ~ checkout.controller.ts ~ order ~ orderInfo:", orderInfo);

            const zaloRes  = await axios.post(process.env.ZALOPAY_ENDPOINT, null, { params: orderInfo })
            console.log("🚀 ~ checkout.controller.ts ~ order ~ zaloRes:", zaloRes);
            res.json({ 
              code: 201,  
              message: 'Thành công!', 
              order_url: zaloRes.data.order_url, 
              zalo_token: zaloRes.data.zp_trans_token
            })
          } else if (paymentMethod === 'MOMO') {
            
          }
        }
      } else {
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
        console.log("🚀 ~ checkout.controller.ts ~ order ~ totalBill:", totalBill);
        const orderInfo = {
          user_id: req["accountUser"].id,
          cart_id: cartId,
          userInfo: userInfo,
          products: products,
          userId: req['accountUser'].id,
          amount: Math.floor(totalBill),
          note: note
        }
        console.log("🚀 ~ checkout.controller.ts ~ order ~ orderInfo:", orderInfo);
        const order = new Order(orderInfo)
        console.log("🚀 ~ checkout.controller.ts ~ order ~ order:", order);
        order.paymentInfo.method = paymentMethod
        await order.save()

        if (paymentMethod === 'COD') {
          res.json({ 
            code: 201,  
            message: 'Thành công!', 
            order: order
          })
          await order.save()
        } else if (paymentMethod === 'VNPAY') {
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
            vnp_Amount: totalBill,
            vnp_IpAddr: '127.0.0.0.1', // ip test local
            vnp_TxnRef: order.id,
            vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:3100/checkout/check-payment-vnpay',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow)
          })
          res.json({ 
            code: 201,  
            message: 'Thành công!', 
            paymentUrl: vnpayResponse
          })
        } else if (paymentMethod === 'ZALOPAY') {
          const embed_data = {
            redirecturl: `http://localhost:5173/checkout/success/${order.id}`
          }
          const items = products.map(p => ({
            itemid: p.product_id,
            itemname: p.title,
            itemprice: Math.floor(p.price * (100 - p.discountPercentage) / 100),
            itemquantity: p.quantity
          }))
          const transID = Math.floor(Math.random() * 1000000)
          const orderInfo = {
            app_id: process.env.ZALOPAY_APP_ID, // Định danh cho ứng dụng đã được cấp bởi ZaloPay.
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // mã giao dich có định dạng yyMMdd_xxxx
            app_user: `${order.userInfo.phone}-${order.id}`, // Thông tin người dùng như: id/username/tên/số điện thoại/email của user.
            app_time: Date.now(), // Thời gian tạo đơn hàng (unix timestamp in milisecond). Thời gian tính đến milisecond, lấy theo current time và không quá 15 phút so với thời điểm thanh toán
            item: JSON.stringify(items), // 	Dữ liệu riêng của đơn hàng. Dữ liệu này sẽ được callback lại cho AppServer khi thanh toán thành công (Nếu không có thì để chuỗi rỗng). Dạng [{...}]
            embed_data: JSON.stringify(embed_data), 
            amount: Math.floor(totalBill), 
            description: `Thanh toán đơn hàng ${transID}`,
            bank_code: "", 
            mac: '',
            callback_url: 'https://164896da51bb.ngrok-free.app/checkout/callback'
          }

          const data = [
            orderInfo.app_id,
            orderInfo.app_trans_id,
            orderInfo.app_user,
            orderInfo.amount,
            orderInfo.app_time,
            orderInfo.embed_data,
            orderInfo.item
          ].join('|');

          orderInfo.mac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY1)
            .update(data)
            .digest('hex')
          console.log("🚀 ~ checkout.controller.ts ~ order ~ orderInfo:", orderInfo);

          const zaloRes  = await axios.post(process.env.ZALOPAY_ENDPOINT, null, { params: orderInfo })
          console.log("🚀 ~ checkout.controller.ts ~ order ~ zaloRes:", zaloRes);
          if (zaloRes.data.return_code === 1) {
            // Thành công
              res.json({ 
              code: 201,  
              message: 'Thành công!', 
              order_url: zaloRes.data.order_url, 
              zalo_token: zaloRes.data.zp_trans_token
            })
          } else if (zaloRes.data.return_code === 2) {
            // Thất bại
            res.json({ 
              code: 400,  
              message: 'Giao dịch thất bại, tài khoản chưa bị trừ tiền, vui lòng thực hiện lại.', 
              error: zaloRes.data
            })
          }
        } else if (paymentMethod === 'MOMO') {

        }

        for (const item of products) {
          await Product.updateOne(
            { _id: item.product_id },
            { $inc: { stock: -item.quantity } } // trừ số lượng
          )
        }

        await Cart.updateOne(
          { _id: cartId },
          { products: [] }
        )
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
    console.log("🚀 ~ checkout.controller.ts ~ callback ~ dataJson:", dataJson);
    const [phone, id] = dataJson.app_user.split("-");
    const order = await Order.findOne({
      _id: id,
      'userInfo.phone': phone,
      deleted: false,
    })
    if (!order) {
      return res.json({ return_code: 0, return_message: 'order not found' })
    }
    const result = await queryOrder(dataJson.app_trans_id)
    console.log("🚀 ~ checkout.controller.ts ~ callback ~ result:", result);
    if (result.status === "PAID") {
      order.paymentInfo.status = "PAID"
    } else if (result.status === "PENDING") {
      order.paymentInfo.status = "PENDING"
    } else if (result.status === "FAILED") {
      order.paymentInfo.status = "FAILED"
    }
    order.paymentInfo.details = {
      app_trans_id: dataJson.app_trans_id,
      app_time: dataJson.app_time,
      amount: dataJson.amount,
      embed_data: dataJson.embed_data,
    }
    await order.save()
    return res.json({ return_code: 1, return_message: "success" }) // Báo cho ZaloPay biết bạn đã nhận callback thành công.
  } catch (error) {
    return res.json({ return_code: 0, return_message: 'retry', error }) // Báo cho ZaloPay retry lại callback (ví dụ server bạn đang lỗi DB).
  }
}

// [POST] /checkout/order-status
export const queryOrder  = async (app_trans_id: string) => {
  const data = `${process.env.ZALOPAY_APP_ID}|${app_trans_id}|${process.env.ZALOPAY_KEY1}`
  const mac = crypto.createHmac("sha256", process.env.ZALOPAY_KEY1 as string)
    .update(data)
    .digest("hex")

  const response = await axios.post(process.env.ZALOPAY_ENDPOINT_QUERY, {
    app_id: process.env.ZALOPAY_APP_ID,
    app_trans_id,
    mac
  })
  console.log("🚀 ~ checkout.controller.ts ~ queryOrder ~ response:", response);
  console.log("app_id:", process.env.ZALOPAY_APP_ID);
  console.log("app_trans_id:", app_trans_id);
  console.log("key1:", process.env.ZALOPAY_KEY1);
  console.log("data string:", data);
  console.log("mac:", mac);

  if (response.data.return_code === 1) {
    return { status: "PAID", data: response.data }
  } else if (response.data.return_code === 2) {
    return { status: "FAILED", data: response.data }
  } else if (response.data.return_code === 3) {
    return { status: "PENDING", data: response.data }
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
      res.json({ 
        code: 400,  
        message: 'Sai chữ ký VNPay'
      })
    }

    const orderId = req.query["vnp_TxnRef"] as string
    const order = await Order.findById(orderId)

    if (!order) {
      res.json({ 
        code: 404,  
        message: 'Không tìm thấy đơn hàng'
      })
    }

    // Nếu thanh toán thành công
    if (req.query["vnp_ResponseCode"] === "00") {
      order.paymentInfo.status = 'PAID'
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
    } else {
      order.paymentInfo.status = 'FAILED'
    }
    
    await order.save()
    res.redirect(`http://localhost:5173/checkout/success/${order.id}`)
  } catch (err) {
    res.json({ 
      code: 500,  
      message: "Lỗi xử lý callback VNPay",
      error: err
    })
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
