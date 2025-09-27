import { Response } from 'express'
import moment from 'moment'
import axios from 'axios'
import crypto from 'crypto'

export const zaloMethod = async (
  totalBill: number, 
  products: {product_id: string, title: string, price: number, discountPercentage: number, quantity: number}[], 
  phoneUser: string, 
  orderId: string, 
  res: Response
) => {
  const embed_data = {
    redirecturl: `http://localhost:5173/checkout/success/${orderId}`
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
    app_user: `${phoneUser}-${orderId}`, // Số điện thoại người dùng - Mã đơn hàng
    app_time: Date.now(), // Thời gian tạo đơn hàng (unix timestamp in milisecond). Thời gian tính đến milisecond, lấy theo current time và không quá 15 phút so với thời điểm thanh toán
    item: JSON.stringify(items), // 	Dữ liệu riêng của đơn hàng. Dữ liệu này sẽ được callback lại cho AppServer khi thanh toán thành công (Nếu không có thì để chuỗi rỗng). Dạng [{...}]
    embed_data: JSON.stringify(embed_data), 
    amount: Math.floor(totalBill), 
    description: `Thanh toán đơn hàng ${transID}`,
    bank_code: "", 
    mac: '',
    callback_url: 'https://d5bb47ca8910.ngrok-free.app/checkout/callback'
  }

  const data = [
    orderInfo.app_id,
    orderInfo.app_trans_id,
    orderInfo.app_user,
    orderInfo.amount,
    orderInfo.app_time,
    orderInfo.embed_data,
    orderInfo.item
  ].join('|')
  orderInfo.mac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY1)
    .update(data)
    .digest('hex')

  const zaloRes  = await axios.post(process.env.ZALOPAY_ENDPOINT_CREATE, null, { params: orderInfo })
  console.log("🚀 ~ zalopayPayment.ts ~ zaloMethod ~ zaloRes:", zaloRes);
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
}