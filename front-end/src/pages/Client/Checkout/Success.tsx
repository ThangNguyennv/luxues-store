import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchOrderAPI, fetchSuccessAPI } from '~/apis/client/checkout.api'
import type { OrderDetailInterface, OrderInfoInterface } from '~/types/order.type'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'
import Skeleton from '@mui/material/Skeleton'
import { useCart } from '~/contexts/client/CartContext'


const Success = () => {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderInfoInterface | null>(null)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const { refreshCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!orderId) return
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: OrderDetailInterface = await fetchSuccessAPI(orderId)
        setOrder(res.order)
      } catch (error) {
      // eslint-disable-next-line no-console
        console.error('Lỗi khi fetch đơn hàng:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [orderId])

  const totalBill = order?.products.reduce((acc, item) => {
    const priceNewForOneProduct =
        item.price * (100 - item.discountPercentage) / 100

    return acc + priceNewForOneProduct * item.quantity
  }, 0)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const paymentMethod = formData.get('type') as string
    if (!order) return
    const payload = {
      orderId: orderId,
      note: order?.note || '',
      paymentMethod: paymentMethod,
      fullName: order?.userInfo.fullName || '',
      phone: order?.userInfo.phone || '',
      address: order?.userInfo.address || ''
    }
    const response = await fetchOrderAPI(payload)
    if (response.code === 201) {
      await refreshCart()
      if (paymentMethod === 'COD') {
        navigate(`/checkout/success/${response.order._id}`)
      } else if (paymentMethod === 'VNPAY') {
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl
        }
      } else if (paymentMethod === 'ZALOPAY') {
        if (response.order_url) {
          window.location.href = response.order_url
        }
      }
    }
    setPaymentMethod('')
  }
  if (loading) {
    return (
      <>
        <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
          <div className='container flex flex-col gap-[20px]'>
            <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={1000} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <div className="flex flex-col gap-[15px]">
              <Skeleton variant="text" width={250} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex flex-col gap-[10px]'>
                <div>
                  <Skeleton variant="text" width={78} height={20} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={78} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </div>
                <div>
                  <Skeleton variant="text" width={89} height={20} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={89} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </div>
                <div>
                  <Skeleton variant="text" width={89} height={20} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={89} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <Skeleton variant="text" width={250} height={45} sx={{ bgcolor: 'grey.400' }}/>
              <div>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader sx={{
                    borderCollapse: 'collapse',
                    '& th, & td': {
                      border: '1px solid #757575' // đường kẻ
                    }
                  }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="text" width={30} height={32} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center">
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="rectangular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="text" width={411} height={18} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="rectangular" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className='flex items-center justify-center'>
                            <Skeleton variant="rectangular" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className='flex items-center justify-end gap-[10px]'>
                <Skeleton variant="text" width={120} height={35} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={120} height={35} sx={{ bgcolor: 'grey.400' }}/>
              </div>
              <div className='flex items-center justify-end gap-[10px]'>
                <Skeleton variant="text" width={120} height={35} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={120} height={35} sx={{ bgcolor: 'grey.400' }}/>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      {order && (
        <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
          <div className='container flex flex-col gap-[20px]'>
            <div className='text-[30px] uppercase font-[600]'>Đơn hàng</div>
            <div className='text-[24px] uppercase font-[500] text-[#168B35]'>
              {order.paymentInfo.status === 'PAID' ?
                <span className='text-[#168B35]'>Chúc mừng bạn đã đặt hàng thành công, đơn hàng của bạn đã được thanh toán, chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất. Xin cảm ơn!</span> :
                <span className='text-[#BC3433]'>Chúc mừng bạn đã đặt hàng thành công, đơn hàng của bạn chưa được thanh toán.</span> }
            </div>
            <div className="flex flex-col gap-[15px]">
              <div className='text-[24px] font-[500]'>Thông tin người đặt: </div>
              <div className='flex flex-col gap-[10px]'>
                <div>
                  <b>Họ và tên: </b>
                  {order.userInfo.fullName}
                </div>
                <div>
                  <b>Số điện thoại: </b>
                  {order.userInfo.phone}
                </div>
                <div>
                  <b>Địa chỉ: </b>
                  {order.userInfo.address}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className='text-[24px] font-[500]'>Thông tin đơn hàng: </div>
              <div>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader sx={{
                    borderCollapse: 'collapse',
                    '& th, & td': {
                      border: '1px solid #757575' // đường kẻ
                    }
                  }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>STT</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hình ảnh</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên sản phẩm</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Đơn giá</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Số lượng</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tổng tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.products && (
                        order.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">
                              {index + 1}
                            </TableCell>
                            <TableCell align="center">
                              <div className='flex items-center justify-center'>
                                <img src={product.thumbnail} className='w-[100px] h-[100px] object-cover'/>
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <span>
                                {product.title}
                              </span>
                            </TableCell>
                            <TableCell align="center">
                              <span>
                                {(product.price * (100 - product.discountPercentage) / 100).toLocaleString()}đ
                              </span>
                            </TableCell>
                            <TableCell align="center">
                              {product.quantity}
                            </TableCell>
                            <TableCell align="center">
                              {((product.price * (100 - product.discountPercentage) / 100) * product.quantity).toLocaleString()}đ
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className='flex items-center justify-end'>
                <div className='flex flex-col gap-[10px]'>
                  <div className='flex items-center gap-[5px]'>
                    <b className='text-[20px]'>Tổng đơn hàng: </b>
                    {totalBill && (
                      <span className='font-[600] text-[25px] text-[#FFAB19]'>{Math.floor(totalBill).toLocaleString()}đ</span>
                    )}
                  </div>
                  {order.paymentInfo.status === 'PAID' ? (
                    <div className='flex flex-col gap-[10px]'>
                      <div className='flex items-center gap-[5px]'>
                        <b className='text-[20px]'>Trạng thái: </b>
                        <span className='font-[600] text-[25px] text-[#18BA2A]'>
                        Đã thanh toán
                        </span>
                      </div>
                      <div className='flex items-center gap-[5px]'>
                        <b className='text-[20px]'>Phương thức thanh toán: </b>
                        <span className='font-[600] text-[25px] text-[#0542AB]'>{order.paymentInfo.method}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='flex flex-col gap-[10px]'>
                        <div className='flex items-center gap-[5px]'>
                          <b className='text-[20px]'>Trạng thái: </b>
                          <span className='font-[600] text-[25px] text-[#BC3433]'>
                            Chưa thanh toán
                          </span>
                        </div>
                        <form onSubmit={handleSubmit} className='flex items-center justify-end gap-[15px]'>
                          <div className='font-[600] text-[18px]'>
                            Thanh toán ngay:
                          </div>
                          <select
                            name="type"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className='cursor-pointer outline-none border rounded-[5px] border-[#9D9995] p-[5px]'
                          >
                            <option value={'COD'}>Thanh toán khi nhận hàng</option>
                            <option value={'VNPAY'}>Thanh toán qua ví VNPAY</option>
                            <option value={'ZALOPAY'}>Thanh toán qua ví Zalopay</option>
                            <option value={'MOMO'}>Thanh toán qua ví MoMo</option>
                          </select>
                          <button type='submit' className='bg-[#FFAB19] text-white px-[15px] py-[8px] rounded-[5px] hover:bg-[#e6a417] transition-all duration-200'>
                            Thanh toán
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Success
