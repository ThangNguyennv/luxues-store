import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSuccessAPI } from '~/apis/client/checkout.api'
import type { OrderDetailInterface, OrderInfoInterface } from '~/types/order.type'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'


const Success = () => {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderInfoInterface | null>(null)

  useEffect(() => {
    fetchSuccessAPI(orderId).then((res: OrderDetailInterface) => {
      setOrder(res.order)
    })
  }, [orderId])
  const totalBill = order?.products.reduce((acc, item) => {
    const priceNewForOneProduct =
        item.price * (100 - item.discountPercentage) / 100

    return acc + priceNewForOneProduct * item.quantity
  }, 0)

  return (
    <>
      {order && (
        <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
          <div className='container flex flex-col gap-[15px]'>
            <div className='text-[30px] uppercase font-[600]'>Đơn hàng</div>
            <div className="flex flex-col gap-[10px]">
              <div className='text-[24px] font-[500]'>Thông tin cá nhân</div>
              <div>
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
              <div className='text-[24px] font-[500]'>Thông tin đơn hàng</div>
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
                              <img src={product.thumbnail} className='w-[100px] h-[100px] object-cover'/>
                            </TableCell>
                            <TableCell align="left">
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
              <div className='flex items-center justify-end gap-[10px]'>
                <b>Tổng đơn hàng: </b>
                <span className='font-[600] text-[20px] text-[#BC3433]'>{totalBill?.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Success