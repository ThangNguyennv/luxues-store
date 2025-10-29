/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react'
import { fetchCartAPI } from '~/apis/client/cart.api'
import type { CartInfoInterface } from '~/types/cart.type'
import { fetchOrderAPI } from '~/apis/client/checkout.api'
import { useCart } from '~/contexts/client/CartContext'
import { useNavigate } from 'react-router-dom'
import { MdOutlineLocalShipping } from 'react-icons/md'
import vnpayLogo from '~/assets/images/Payment/vnpay-logo.png'
import zalopayLogo from '~/assets/images/Payment/zalopay-logo.png'
import momoLogo from '~/assets/images/Payment/momo-logo.png'
import { useAuth } from '~/contexts/client/AuthContext'

const Checkout = () => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)
  const [, setLoading] = useState(false)
  const { refreshCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const navigate = useNavigate()
  const { accountUser } = useAuth()

  const [formValues, setFormValues] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  })

  useEffect(() => {
    // Tự động điền thông tin người dùng khi có
    if (accountUser) {
      setFormValues(prev => ({
        ...prev,
        fullName: accountUser.fullName || '',
        phone: accountUser.phone || '',
        address: accountUser.address || ''
      }))
    }
    const fetchData = async () => {
      try {
        setLoading(true)
        const cartRes = await fetchCartAPI()
        setCartDetail(cartRes.cartDetail)
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [accountUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }
  const totalBill = useMemo(() => {
    if (!cartDetail?.products) return 0
    return cartDetail?.products.reduce((acc, item) => {
      const priceNewForOneProduct =
      item.product_id.price * (100 - item.product_id.discountPercentage) / 100

      return acc + priceNewForOneProduct * item.quantity
    }, 0)
  }, [cartDetail])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = { ...formValues, paymentMethod }
    try {
      const response = await fetchOrderAPI(payload)
      if (response.code === 201) {
        await refreshCart()
        if (paymentMethod === 'COD') {
          navigate(`/checkout/success/${response.order._id}`)
        } else if (paymentMethod === 'VNPAY' && response.paymentUrl) {
          window.location.href = response.paymentUrl
        } else if (paymentMethod === 'ZALOPAY' && response.order_url) {
          window.location.href = response.order_url
        } else if (paymentMethod === 'MOMO' && response.data?.payUrl) {
          window.location.href = response.data.payUrl
        }
        setPaymentMethod('')
      } else {
        alert(response.message || 'Có lỗi xảy ra, vui lòng thử lại.')
      }
    } catch (error) {
      alert('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.')
    }
  }

  return (
    <>
      <div className='bg-gray-50 py-12 mb-[100px]'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl font-bold mb-8'>Thanh toán</h1>
          <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

            {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG VÀ THANH TOÁN */}
            <div className='lg:col-span-2 bg-white p-6 rounded-lg shadow-md flex flex-col gap-6'>
              <div>
                <h2 className='text-xl font-semibold mb-4'>Thông tin giao hàng</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='form-group'>
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formValues.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='form-group sm:col-span-2'>
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='form-group sm:col-span-2'>
                    <label>Ghi chú (tùy chọn)</label>
                    <textarea name="note" value={formValues.note} onChange={handleInputChange} rows={3}></textarea>
                  </div>
                </div>
              </div>

              <div>
                <h2 className='text-xl font-semibold mb-4'>Phương thức thanh toán</h2>
                <div className="flex flex-col gap-3">
                  <label className={
                    `flex items-center gap-4 cursor-pointer border p-4 rounded-lg transition-all 
                    ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`
                  }>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD" checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <MdOutlineLocalShipping size={28} />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className={
                    `flex items-center gap-4 cursor-pointer border p-4 rounded-lg transition-all 
                    ${paymentMethod === 'VNPAY' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`
                  }>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <img src={vnpayLogo} alt="vnpay-logo" className='h-[30px] object-contain'/>
                    <span>Thanh toán chuyển khoản VNPay</span>
                  </label>
                  <label className={
                    `flex items-center gap-4 cursor-pointer border p-4 rounded-lg transition-all 
                    ${paymentMethod === 'ZALOPAY' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`
                  }>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ZALOPAY"
                      checked={paymentMethod === 'ZALOPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <img src={zalopayLogo} alt="vnpay-logo" className='h-[30px] object-contain'/>
                    <span>Thanh toán chuyển khoản ZaloPay</span>
                  </label>
                  <label className={
                    `flex items-center gap-4 cursor-pointer border p-4 rounded-lg transition-all 
                    ${paymentMethod === 'MOMO' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`
                  }>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MOMO"
                      checked={paymentMethod === 'MOMO'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <img src={momoLogo} alt="vnpay-logo" className='h-[30px] object-contain'/>
                    <span>Thanh toán chuyển khoản MoMo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className='lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit flex flex-col gap-4'>
              <h2 className='text-xl font-semibold border-b pb-3'>Đơn hàng của bạn</h2>
              {cartDetail?.products.map((item) => (
                <div key={`${item.product_id}-${item.color}-${item.size}`} className="flex items-center gap-4">
                  <div className="relative">
                    <img src={item.product_id?.thumbnail} className="w-16 h-16 object-cover rounded"/>
                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.product_id?.title}</p>
                    <p className="text-xs text-gray-500">{item.color}, {item.size}</p>
                  </div>
                  <span className="font-semibold text-sm">{item.totalPrice?.toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
              <div className="border-t pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{Math.floor(totalBill).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">{Math.floor(totalBill).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              <button
                type='submit'
                className='w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors mt-4'
              >
                Đặt hàng
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Checkout