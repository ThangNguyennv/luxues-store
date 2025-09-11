import { useEffect, useState } from 'react'
import { fetchCartAPI, fetchDeleteProductInCartAPI } from '~/apis/client/cart.api'
import { useProductContext } from '~/contexts/client/ProductContext'
import type { CartDetailInterface, CartInfoInterface } from '~/types/cart.type'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import TableContainer from '@mui/material/TableContainer'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const Cart = () => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { dispatchAlert } = useAlertContext()
  useEffect(() => {
    fetchCartAPI().then((res: CartDetailInterface) => {
      setCartDetail(res.cartDetail)
    })
  }, [])
  const { stateProduct, dispatchProduct } = useProductContext()
  const { products } = stateProduct
  const handleCheckAll = (checked: boolean) => {

  }
  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }
  const isCheckAll = true
  const totalBill = cartDetail?.products.reduce((acc, item) => {
    const product = products.find(p => p._id === item.product_id)
    if (!product) return acc

    const priceNewForOneProduct =
    product.price * (100 - product.discountPercentage) / 100

    return acc + priceNewForOneProduct * item.quantity
  }, 0)
  const handleDelete = async () => {
    if (!selectedId) return
    const response = await fetchDeleteProductInCartAPI(selectedId)
    if (response.code === 204) {
      dispatchProduct({
        type: 'SET_DATA',
        payload: {
          products: products.filter((product) => product._id !== selectedId)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  return (
    <>
      {cartDetail && (
        <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
          <div className='container flex flex-col gap-[15px]'>
            <div className='text-[30px] uppercase font-[600]'>Giỏ hàng của bạn</div>
            <div className='flex items-start justify-between gap-[20px]'>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader sx={{
                  borderCollapse: 'collapse',
                  '& th, & td': {
                    border: '1px solid #757575' // đường kẻ
                  }
                }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center' sx={{ backgroundColor: '#003459' }}>
                        <Checkbox
                          checked={isCheckAll}
                          onChange={(event) => handleCheckAll(event.target.checked)}
                          {...label}
                          size="small"
                          sx={{ padding: 0 }}
                        />
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hình ảnh</TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên sản phẩm</TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Đơn giá</TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Giảm giá</TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Số lượng</TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartDetail.products.map((cart, index) => {
                      const item = products.find((product) => product._id === cart.product_id)
                      return (
                        <>
                          {item && (
                            <TableRow key={index}>
                              <TableCell align="center">
                                <Checkbox
                                  checked={true}
                                  size="small"
                                  sx={{ padding: 0 }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <img src={item.thumbnail} className='w-[100px] h-[100px] object-cover'/>
                              </TableCell>
                              <TableCell align="left">
                                <span>
                                  {item.title}
                                </span>
                              </TableCell>
                              <TableCell align="left">
                                <span>
                                  {item.price.toLocaleString()}đ
                                </span>
                              </TableCell>
                              <TableCell align="center">
                                <span>
                                  {item.discountPercentage}%
                                </span>
                              </TableCell>
                              <TableCell align="center">
                                <input
                                  onChange={(event) => setQuantity(Number(event.target.value))}
                                  className='border rounded-[5px] text-center'
                                  type='number'
                                  name='quantity'
                                  value={cart.quantity}
                                  min={1}
                                  max={item.stock}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <button
                                  onClick={() => handleOpen(item._id)}
                                  className='flex items-center justify-center text-red-500'>
                                  <RiDeleteBin5Line className='text-[17px]'/>
                                </button>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      )
                    })}
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="delete-dialog-title"
                    >
                      <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                    Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button onClick={handleDelete} color="error" variant="contained">
                    Xóa
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='flex flex-col gap-[24px] w-[50%] border rounded-[5px] py-[20px] px-[24px]'>
                <div className='text-[26px] font-[600]'>Tóm tắt đơn hàng</div>
                <div className='flex flex-col gap-[20px]'>
                  <div className='flex items-center justify-between'>
                    <b>Tổng đơn hàng: </b>
                    <div className='font-[600]'>{Math.floor(totalBill ?? 0).toLocaleString()}đ</div>
                  </div>
                  <b>Giảm giá: </b>
                  <b>Phí vận chuyển: </b>
                </div>
                <div><b>Tổng tiền phải trả: </b></div>
                <div className='flex items-center gap-[12px]'>
                  <input placeholder='Nhập mã giảm giá...' className='border rounded-[5px] flex-1 py-[10px] px-[7px]'/>
                  <button className='border rounded-[30px] bg-[#00171F] p-[10px] text-white w-[30%]'>Áp dụng</button>
                </div>
                <div className='border rounded-[10px] bg-[#00171F] py-[15px] text-white text-center text-[20px]'>Thanh toán</div>
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  )
}

export default Cart