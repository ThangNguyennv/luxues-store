// import { useEffect, useState } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import { fetchSuccessAPI } from '~/apis/client/checkout.api'
// import type { OrderDetailInterface, OrderInfoInterface } from '~/types/order.type'
// import Table from '@mui/material/Table'
// import TableHead from '@mui/material/TableHead'
// import TableBody from '@mui/material/TableBody'
// import TableCell from '@mui/material/TableCell'
// import TableRow from '@mui/material/TableRow'
// import TableContainer from '@mui/material/TableContainer'
// import Skeleton from '@mui/material/Skeleton'

// const Success = () => {
//   const params = useParams()
//   const orderId = params.orderId as string
//   const [order, setOrder] = useState<OrderInfoInterface | null>(null)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (!orderId) return
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const res: OrderDetailInterface = await fetchSuccessAPI(orderId)
//         setOrder(res.order)
//       } catch (error) {
//       // eslint-disable-next-line no-console
//         console.error('Lỗi khi fetch đơn hàng:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [orderId])

//   const totalBill = order?.products.reduce((acc, item) => {
//     const priceNewForOneProduct =
//         item.price * (100 - item.discountPercentage) / 100

//     return acc + priceNewForOneProduct * item.quantity
//   }, 0)

//   if (loading) {
//     return (
//       <>
//         <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
//           <div className='container flex flex-col gap-[20px]'>
//             <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>
//             <Skeleton variant="text" width={1000} height={32} sx={{ bgcolor: 'grey.400' }}/>
//             <div className="flex flex-col gap-[15px]">
//               <Skeleton variant="text" width={250} height={32} sx={{ bgcolor: 'grey.400' }}/>
//               <div className='flex flex-col gap-[10px]'>
//                 <div>
//                   <Skeleton variant="text" width={78} height={20} sx={{ bgcolor: 'grey.400' }}/>
//                   <Skeleton variant="text" width={78} height={20} sx={{ bgcolor: 'grey.400' }}/>
//                 </div>
//                 <div>
//                   <Skeleton variant="text" width={89} height={20} sx={{ bgcolor: 'grey.400' }}/>
//                   <Skeleton variant="text" width={89} height={20} sx={{ bgcolor: 'grey.400' }}/>
//                 </div>
//                 <div>
//                   <Skeleton variant="text" width={89} height={20} sx={{ bgcolor: 'grey.400' }}/>
//                   <Skeleton variant="text" width={89} height={20} sx={{ bgcolor: 'grey.400' }}/>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col gap-[10px]">
//               <Skeleton variant="text" width={250} height={45} sx={{ bgcolor: 'grey.400' }}/>
//               <div>
//                 <TableContainer sx={{ maxHeight: 600 }}>
//                   <Table stickyHeader sx={{
//                     borderCollapse: 'collapse',
//                     '& th, & td': {
//                       border: '1px solid #757575' // đường kẻ
//                     }
//                   }}>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="text" width={30} height={32} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell align="center">
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align="center">
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="rectangular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align="center">
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="text" width={411} height={18} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align="center">
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="rectangular" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align="center">
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                         <TableCell align="center">
//                           <div className='flex items-center justify-center'>
//                             <Skeleton variant="rectangular" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </div>
//               <div className='flex items-center justify-end gap-[10px]'>
//                 <Skeleton variant="text" width={120} height={35} sx={{ bgcolor: 'grey.400' }}/>
//                 <Skeleton variant="text" width={120} height={35} sx={{ bgcolor: 'grey.400' }}/>
//               </div>
//               <div className='flex items-center justify-end gap-[10px]'>
//                 <Skeleton variant="text" width={120} height={35} sx={{ bgcolor: 'grey.400' }}/>
//                 <Skeleton variant="text" width={120} height={35} sx={{ bgcolor: 'grey.400' }}/>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     )
//   }
//   return (
//     <>
//       {order && (
//         <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
//           <div className='container flex flex-col gap-[20px]'>
//             <div className='text-[30px] uppercase font-[600]'>Đơn hàng</div>
//             <div className="flex flex-col gap-[15px]">
//               <div className='text-[24px] font-[500]'>Thông tin người đặt: </div>
//               <div className='flex flex-col gap-[10px]'>
//                 <div>
//                   <b>Họ và tên: </b>
//                   {order.userInfo.fullName}
//                 </div>
//                 <div>
//                   <b>Số điện thoại: </b>
//                   {order.userInfo.phone}
//                 </div>
//                 <div>
//                   <b>Địa chỉ: </b>
//                   {order.userInfo.address}
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col gap-[10px]">
//               <div className='text-[24px] font-[500]'>Thông tin đơn hàng: </div>
//               <div>
//                 <TableContainer sx={{ maxHeight: 600 }}>
//                   <Table stickyHeader sx={{
//                     borderCollapse: 'collapse',
//                     '& th, & td': {
//                       border: '1px solid #757575' // đường kẻ
//                     }
//                   }}>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>STT</TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hình ảnh</TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên sản phẩm</TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Đơn giá</TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Số lượng</TableCell>
//                         <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tổng tiền</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {order.products && (
//                         order.products.map((product, index) => (
//                           <TableRow key={index}>
//                             <TableCell align="center">
//                               {index + 1}
//                             </TableCell>
//                             <TableCell align="center">
//                               <div className='flex items-center justify-center'>
//                                 <img src={product.thumbnail} className='w-[100px] h-[100px] object-cover'/>
//                               </div>
//                             </TableCell>
//                             <TableCell align="center">
//                               <span>
//                                 {product.title}
//                               </span>
//                             </TableCell>
//                             <TableCell align="center">
//                               <span>
//                                 {Math.floor((product.price * (100 - product.discountPercentage) / 100)).toLocaleString()}đ
//                               </span>
//                             </TableCell>
//                             <TableCell align="center">
//                               {product.quantity}
//                             </TableCell>
//                             <TableCell align="center">
//                               {Math.floor(((product.price * (100 - product.discountPercentage) / 100) * product.quantity)).toLocaleString()}đ
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </div>
//               <div className='flex items-center justify-end'>
//                 <div className='flex flex-col gap-[10px]'>
//                   <div className='flex items-center gap-[5px]'>
//                     <b className='text-[20px]'>Tổng đơn hàng: </b>
//                     {totalBill && (
//                       <span className='font-[600] text-[25px] text-[#FFAB19]'>{Math.floor(totalBill).toLocaleString()}đ</span>
//                     )}
//                   </div>
//                   <div className='flex flex-col gap-[10px]'>
//                     {order.paymentInfo.status === 'PAID' ? (
//                       <div className='flex items-center gap-[5px]'>
//                         <b className='text-[20px]'>Trạng thái: </b>
//                         <span className='font-[600] text-[25px] text-[#18BA2A]'>
//                           Đã thanh toán
//                         </span>
//                       </div>
//                     ) : (
//                       order.paymentInfo.status === 'PENDING' ? (
//                         <div className='flex items-center gap-[5px]'>
//                           <b className='text-[20px]'>Trạng thái: </b>
//                           <span className='font-[600] text-[25px] text-[#BC3433]'>
//                             Chưa thanh toán
//                           </span>
//                         </div>
//                       ) : (
//                         <div className='flex items-center gap-[5px]'>
//                           <b className='text-[20px]'>Trạng thái: </b>
//                           <span className='font-[600] text-[25px] text-[#BC3433]'>
//                             Giao dịch thất bại
//                           </span>
//                         </div>
//                       )
//                     )}
//                     <div className='flex items-center gap-[5px]'>
//                       <b className='text-[20px]'>Phương thức thanh toán: </b>
//                       <span className='font-[600] text-[25px] text-[#0542AB]'>{order.paymentInfo.method}</span>
//                     </div>
//                     {(order.paymentInfo.status === 'FAILED' || order.paymentInfo.status === 'PENDING') && (
//                       <div>
//                         <Link
//                           to={'/checkout'}
//                           className='border rounded-[5px] bg-emerald-600 p-[4px] text-amber-50 font-[500]'
//                         >
//                           Thanh toán lại
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default Success

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchSuccessAPI } from '~/apis/client/checkout.api'
import type { OrderDetailInterface, OrderInfoInterface } from '~/types/order.type'
import Skeleton from '@mui/material/Skeleton'
import { FaCheckCircle } from 'react-icons/fa' // Icon thành công

const Success = () => {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderInfoInterface | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    setLoading(true)
    const fetchData = async () => {
      try {
        const res: OrderDetailInterface = await fetchSuccessAPI(orderId)
        setOrder(res.order)
      } catch (error) {
        console.error('Lỗi khi fetch đơn hàng:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [orderId])


  if (loading) {
    // Skeleton UI cải tiến
    return (
      <div className='container mx-auto p-8'>
        <Skeleton variant="text" width="60%" height={50} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Không tìm thấy đơn hàng</h1>
        <p className="text-gray-500 mt-2">Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ bộ phận hỗ trợ.</p>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-2 rounded-lg">Quay về trang chủ</Link>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-4'>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mb-[100px]">

          {/* Header Thông báo */}
          <div className="text-center border-b pb-6 mb-6">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Đặt hàng thành công!</h1>
            <p className="text-gray-500 mt-2">Cảm ơn bạn đã mua sắm. Dưới đây là chi tiết đơn hàng của bạn.</p>
          </div>

          {/* Thông tin chính */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Thông tin giao hàng</h2>
              <p><strong>Họ tên:</strong> {order.userInfo.fullName}</p>
              <p><strong>Điện thoại:</strong> {order.userInfo.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.userInfo.address}</p>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h2>
              <p><strong>Mã đơn hàng:</strong> #{order._id}</p>
              <p><strong>Ngày đặt:</strong> {new Date(order.createdAt!).toLocaleDateString('vi-VN')}</p>
              <p><strong>Thanh toán:</strong> {order.paymentInfo.method}</p>
              <p><strong>Trạng thái:</strong>
                <span className={`font-semibold ml-1 ${order.paymentInfo.status === 'PAID' ? 'text-green-600' : order.paymentInfo.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {order.paymentInfo.status === 'PAID' ? 'Đã thanh toán' : order.paymentInfo.status === 'PENDING' ? 'Chờ thanh toán' : 'Thất bại'}
                </span>
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
              </p>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Sản phẩm đã đặt</h2>
            <div className="border rounded-lg overflow-hidden">
              {order.products.map((product) => (
                <div key={product.product_id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                  <img src={product.thumbnail} className="w-20 h-20 object-cover rounded"/>
                  <div className="flex-1">
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-sm text-gray-500">Phân loại: {product.color}, {product.size}</p>
                    <p className="text-sm text-gray-500">Số lượng: {product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {Math.floor((product.price * (100 - product.discountPercentage) / 100) * product.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="flex flex-col items-end gap-2 border-t pt-6">
            <div className="flex justify-between w-full max-w-sm">
              <span className="text-gray-600">Tổng tạm tính:</span>
              <span className="font-semibold">{order.amount.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between w-full max-w-sm">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-semibold">Miễn phí</span>
            </div>
            <div className="flex justify-between w-full max-w-sm font-bold text-xl mt-2">
              <span>Tổng cộng:</span>
              <span className="text-red-600">{order.amount.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Các nút hành động */}
          <div className="mt-8 text-center">
            <Link to="/user/my-orders" className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Quản lý đơn hàng
            </Link>
            <Link to="/" className="ml-4 text-gray-600 font-semibold hover:underline">
              Tiếp tục mua sắm
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Success