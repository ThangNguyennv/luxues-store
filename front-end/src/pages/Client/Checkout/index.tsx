import { useEffect, useState } from 'react'
import { fetchCartAPI } from '~/apis/client/cart.api'
import type { CartInfoInterface } from '~/types/cart.type'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'
import type { ProductInfoInterface } from '~/types/product.type'
import { fetchProductsAPI } from '~/apis/client/product.api'
import { fetchOrderAPI } from '~/apis/client/checkout.api'
import Skeleton from '@mui/material/Skeleton'
import { useCart } from '~/contexts/client/CartContext'

const Checkout = () => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)
  const [products, setProducts] = useState<ProductInfoInterface[]>([])
  const [loading, setLoading] = useState(false)
  const { refreshCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [cartRes, productRes] = await Promise.all([
          fetchCartAPI(),
          fetchProductsAPI()
        ])

        setCartDetail(cartRes.cartDetail)
        setProducts(productRes.allProducts)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Lỗi khi fetch dữ liệu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalBill = cartDetail?.products.reduce((acc, item) => {
    const product = products.find(p => p._id === item.product_id)
    if (!product) return acc

    const priceNewForOneProduct =
    product.price * (100 - product.discountPercentage) / 100

    return acc + priceNewForOneProduct * item.quantity
  }, 0)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      totalBill: Number(totalBill),
      fullName: String(formData.get('fullName') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      address: String(formData.get('address') ?? '')
    }
    const response = await fetchOrderAPI(payload)
    if (response.code === 201) {
      await refreshCart()
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl
      }
    }
  }
  if (loading) {
    return (
      <>
        <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
          <div className='container flex flex-col gap-[15px]'>
            <Skeleton variant="text" width={200} height={45} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex flex-col gap-[20px]'>
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
                          <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                        </div>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <div className='flex items-center justify-center'>
                          <Skeleton variant="text" width={60} height={20} sx={{ bgcolor: 'grey.400' }}/>
                        </div>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <div className='flex items-center justify-center'>
                          <Skeleton variant="text" width={70} height={20} sx={{ bgcolor: 'grey.400' }}/>
                        </div>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <div className='flex items-center justify-center'>
                          <Skeleton variant="text" width={60} height={20} sx={{ bgcolor: 'grey.400' }}/>
                        </div>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <div className='flex items-center justify-center'>
                          <Skeleton variant="text" width={50} height={20} sx={{ bgcolor: 'grey.400' }}/>
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
                          <Skeleton variant="text" width={412} height={17} sx={{ bgcolor: 'grey.400' }}/>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className='flex items-center justify-center'>
                          <Skeleton variant="text" width={60} height={20} sx={{ bgcolor: 'grey.400' }}/>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className='flex items-center justify-center'>
                          <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='flex items-center justify-end gap-[5px]'>
                <Skeleton variant="text" width={125} height={24} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={89} height={30} sx={{ bgcolor: 'grey.400' }}/>
              </div>
              <Skeleton variant="text" width={300} height={45} sx={{ bgcolor: 'grey.400' }}/>
              <form onSubmit={handleSubmit} className='flex flex-col gap-[15px]'>
                <input type="hidden" name="position" value={1} />
                <div className='form-group'>
                  <Skeleton variant="text" width={74} height={20} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="rectangular" width={1536} height={36} sx={{ bgcolor: 'grey.400' }}/>
                </div>
                <div className='form-group'>
                  <Skeleton variant="text" width={101} height={20} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="rectangular" width={1536} height={36} sx={{ bgcolor: 'grey.400' }}/>
                </div>
                <div className='form-group'>
                  <Skeleton variant="text" width={55} height={20} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="rectangular" width={1536} height={36} sx={{ bgcolor: 'grey.400' }}/>
                </div>
                <div className='flex items-center justify-end'>
                  <Skeleton variant="rectangular" width={122} height={50} sx={{ bgcolor: 'grey.400' }}/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {cartDetail && (
        <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
          <div className='container flex flex-col gap-[15px]'>
            <div className='text-[30px] uppercase font-[600]'>Đặt hàng</div>
            <div className='flex flex-col gap-[20px]'>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartDetail.products.map((cart, index) => {
                      const item = products.find((product) => product._id.toString() === cart.product_id.toString())
                      return (
                        <>
                          {item && (
                            <TableRow key={index}>
                              <TableCell align="center">
                                {index + 1}
                              </TableCell>
                              <TableCell align="center">
                                <div className='flex items-center justify-center'>
                                  <img src={item.thumbnail} className='w-[100px] h-[100px] object-cover'/>
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                <span>
                                  {item.title}
                                </span>
                              </TableCell>
                              <TableCell align="center">
                                <span>
                                  {(item.price * (100 - item.discountPercentage) / 100).toLocaleString()}đ
                                </span>
                              </TableCell>
                              <TableCell align="center">
                                {cart.quantity}
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='flex items-center justify-end gap-[5px]'>
                <b>Tổng thanh toán: </b>
                <span className='text-[#BC3433] font-[600] text-[20px]'>{Math.floor(totalBill ?? 0).toLocaleString()}đ</span>
              </div>
              <div className='text-[30px] uppercase font-[600]'>
                Địa chỉ nhận hàng
              </div>
              <form onSubmit={handleSubmit} className='flex flex-col gap-[15px]'>
                <input type="hidden" name="position" value={1} />
                <div className='form-group'>
                  <label htmlFor='fullName'><b>Họ và tên: </b></label>
                  <input
                    type='text'
                    name='fullName'
                    id='fullName'
                    className=''
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='phone'><b>Số điện thoại: </b></label>
                  <input
                    type='tel'
                    name='phone'
                    id='phone'
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='address'><b>Địa chỉ: </b></label>
                  <input
                    type='text'
                    name='address'
                    id='address'
                    required
                  />
                </div>
                <div className='flex items-center justify-end'>
                  <button
                    type='submit'
                    className='uppercase border rounded-[10px] text-center px-[20px] py-[12px] bg-[#BC3433] text-white'
                  >
                    Đặt hàng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Checkout