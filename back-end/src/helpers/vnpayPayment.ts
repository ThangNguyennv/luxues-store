import { Response } from 'express'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, HashAlgorithm } from 'vnpay'

export const vnpayCreate = new VNPay({
  // ⚡ Cấu hình bắt buộc
  tmnCode: process.env.VNP_TMN_CODE,
  secureSecret: process.env.VNP_HASH_SECRET,
  vnpayHost: 'https://sanbox.vnpayment.vn',

  // 🔧 Cấu hình tùy chọn
  testMode: true, // Chế độ test
  hashAlgorithm: HashAlgorithm.SHA512, // Thuật toán mã hóa
  loggerFn: ignoreLogger // Custom logger
})

export const vnpayMethod = (totalBill: number, orderId: string,  res: Response) => {
  const expire = new Date()
  expire.setMinutes(expire.getMinutes() + 15) 

  const vnpayResponse = vnpayCreate.buildPaymentUrl({
    vnp_Amount: totalBill,
    vnp_IpAddr: '127.0.0.0.1', // ip test local
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toán đơn hàng: ${orderId}`,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'http://localhost:3100/checkout/check-payment-vnpay',
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(expire),
  })
  res.json({ 
    code: 201,  
    message: 'Tạo link thanh toán thành công!', 
    paymentUrl: vnpayResponse
  })
}