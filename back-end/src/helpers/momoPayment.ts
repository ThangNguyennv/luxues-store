import axios from 'axios'
import crypto from 'crypto'
import { Response } from 'express'
import Cart from '~/models/cart.model'
import Order from '~/models/order.model'
import { Request } from 'express'

export const momoCreateOrder = async (id: string, totalBill: number, res: Response) => {
  const newOrderId = `${id}-${Date.now()}`
  const accessKey = 'F8BBA842ECF85'
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
  const orderInfoText = `Thanh toán đơn hàng ${id}`
  const partnerCode = 'MOMO'
  const redirectUrl = `http://localhost:5173/checkout/success/${id}`
  const ipnUrl = 'https://1cc7842f3113.ngrok-free.app/checkout/momo-callback'
  const requestType = "payWithMethod"
  const amount = Math.floor(totalBill)
  const orderId = newOrderId
  const requestId = orderId
  const extraData =''
  const orderGroupId =''
  const autoCapture =true
  const lang = 'vi'

  const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfoText + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex')
          
  const requestBody = JSON.stringify({
    partnerCode : partnerCode,
    partnerName : "Test",
    storeId : "MomoTestStore",
    requestId : requestId,
    amount : amount,
    orderId : orderId,
    orderInfo : orderInfoText,
    redirectUrl : redirectUrl,
    ipnUrl : ipnUrl,
    lang : lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData : extraData,
    orderGroupId: orderGroupId,
    signature : signature,
  })

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    data: requestBody
  }
  let result: any
  try {
    result = await axios(options)
    return res.json({ code: 201, message: 'Thành công', data: result.data })
  } catch (error) {
    return res.json({ code: 500, message: 'Lỗi', error: error, data: result })
  }
}

// [POST] /checkout/momo-callback
export const momoCallback = async (req: Request, res: Response) => {
  console.log("Vào callback momo")
  const data = req.body
  let dataJson = typeof data === 'string' ? JSON.parse(data) : data
  const { signature } = dataJson
  const accessKey = 'F8BBA842ECF85'
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'

  const rawSignature =
    "accessKey=" + accessKey +
    "&amount=" + dataJson.amount +
    "&extraData=" + dataJson.extraData +
    "&message=" + dataJson.message +
    "&orderId=" + dataJson.orderId +
    "&orderInfo=" + dataJson.orderInfo +
    "&orderType=" + dataJson.orderType +
    "&partnerCode=" + dataJson.partnerCode +
    "&payType=" + dataJson.payType +
    "&requestId=" + dataJson.requestId +
    "&responseTime=" + dataJson.responseTime +
    "&resultCode=" + dataJson.resultCode +
    "&transId=" + dataJson.transId
  
  const signatureCheck = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex")
  if (signature === signatureCheck) {
    // Hợp lệ
    const orderId = dataJson.orderId.split('-')[0]
    const order = await Order.findOne({
        _id: orderId,
        deleted: false,
    })
    if (!order) {
      return res.json({ resultCode : 42, message : 'order not found' })
    }
    if (dataJson.resultCode == 0) {
      // Thanh toán thành công
      await Cart.updateOne(
        { _id: order.cart_id },
        { products: [] }
      )
      order.paymentInfo.status = 'PAID'
        // Lưu thông tin giao dịch
      order.paymentInfo.details = {
        amount: dataJson.amount,               
        orderId: orderId, 
        orderInfo: dataJson.orderInfo,
        responseTime: dataJson.responseTime,
        resultCode: dataJson.resultCode,      
        partnerCode: dataJson.partnerCode,
        requestId: dataJson.requestId,
        transId: dataJson.transId,
        payType: dataJson.payType,    
      }
    } 
    if (dataJson.resultCode !== 0) {
      // Thanh toán thất bại / bị hủy
      order.paymentInfo.status = 'FAILED'
      order.paymentInfo.details = {
        redirectUrl: `http://localhost:5173/cart`
      }
    }
    await order.save()
    return res.json({ code: 200, message: "Thành công" })
  } else {
    // Sai chữ ký
    return res.json({ code: 400, message: "invalid signature" })
  }
}