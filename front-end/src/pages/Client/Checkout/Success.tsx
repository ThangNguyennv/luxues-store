import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchSuccessAPI } from '~/apis/client/checkout.api'
import type { OrderDetailInterface, OrderInfoInterface } from '~/types/order.type'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'
import Skeleton from '@mui/material/Skeleton'

const Success = () => {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderInfoInterface | null>(null)
  const [loading, setLoading] = useState(false)

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
                                {Math.floor((product.price * (100 - product.discountPercentage) / 100)).toLocaleString()}đ
                              </span>
                            </TableCell>
                            <TableCell align="center">
                              {product.quantity}
                            </TableCell>
                            <TableCell align="center">
                              {Math.floor(((product.price * (100 - product.discountPercentage) / 100) * product.quantity)).toLocaleString()}đ
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
                  <div className='flex flex-col gap-[10px]'>
                    {order.paymentInfo.status === 'PAID' ? (
                      <div className='flex items-center gap-[5px]'>
                        <b className='text-[20px]'>Trạng thái: </b>
                        <span className='font-[600] text-[25px] text-[#18BA2A]'>
                          Đã thanh toán
                        </span>
                      </div>
                    ) : (
                      order.paymentInfo.status === 'PENDING' ? (
                        <div className='flex items-center gap-[5px]'>
                          <b className='text-[20px]'>Trạng thái: </b>
                          <span className='font-[600] text-[25px] text-[#BC3433]'>
                            Chưa thanh toán
                          </span>
                        </div>
                      ) : (
                        <div className='flex items-center gap-[5px]'>
                          <b className='text-[20px]'>Trạng thái: </b>
                          <span className='font-[600] text-[25px] text-[#BC3433]'>
                            Giao dịch thất bại
                          </span>
                        </div>
                      )
                    )}
                    <div className='flex items-center gap-[5px]'>
                      <b className='text-[20px]'>Phương thức thanh toán: </b>
                      <span className='font-[600] text-[25px] text-[#0542AB]'>{order.paymentInfo.method}</span>
                    </div>
                    {order.paymentInfo.status === 'FAILED' && (
                      <div>
                        <Link
                          to={'/checkout'}
                          className='border rounded-[5px] bg-emerald-600 p-[4px] text-amber-50 font-[500]'
                        >
                        Thanh toán lại
                        </Link>
                      </div>
                    )}
                  </div>
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
