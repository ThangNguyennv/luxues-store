import { useEffect, useState } from 'react'
import { fetchCartAPI, fetchChangeMultiAPI, fetchDeleteProductInCartAPI } from '~/apis/client/cart.api'
import type { CartInfoInterface } from '~/types/cart.type'
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
import type { ProductInfoInterface } from '~/types/product.type'
import { fetchProductsAPI } from '~/apis/client/product.api'
import { Link } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'

const Cart = () => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)
  const [openDeleteOne, setOpenDeleteOne] = useState(false)
  const [openDeleteAll, setOpenDeleteAll] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { dispatchAlert } = useAlertContext()
  const [products, setProducts] = useState<ProductInfoInterface[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actionType, setActionType] = useState('')
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      if (cartDetail) {
        const allIds = cartDetail.products.map((product) => product.product_id)
        setSelectedIds(allIds)
      }
    } else {
      setSelectedIds([])
    }
  }
  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpenDeleteOne(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpenDeleteOne(false)
  }

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
      if (cartDetail) {
        setCartDetail({ ...cartDetail, products: cartDetail.products.filter((product) => product.product_id !== selectedId) })
      }
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpenDeleteOne(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const typeChange = actionType
    if (selectedIds.length === 0) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn ít nhất một bản ghi!', severity: 'error' }
      })
      return
    }
    if (!typeChange) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn hành động!', severity: 'error' }
      })
      return
    }

    if (typeChange === 'delete-all') {
      setPendingAction('delete-all')
      setOpenDeleteAll(true)
      return
    }
    await executeAction(typeChange)
  }

  const executeAction = async (typeChange: string) => {
    if (cartDetail) {
      const selectedProducts = cartDetail.products.filter(product =>
        selectedIds.includes(product.product_id)
      )

      let result: string[] = []
      if (typeChange === 'change-quantity') {
        result = selectedProducts.map(product => {
          const quantityInput = document.querySelector<HTMLInputElement>(
            `input[name="quantity"][data-id="${product.product_id}"]`
          )
          const quantity = quantityInput?.value
          return `${product.product_id}-${quantity}`
        })
      } else {
        result = selectedProducts.map(product => product.product_id)
      }

      const response = await fetchChangeMultiAPI({ ids: result, type: typeChange })

      if ([200, 204].includes(response.code)) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        if (typeChange === 'delete-all') {
          setCartDetail({
            ...cartDetail,
            products: cartDetail.products.filter(
              (p) => !selectedIds.includes(p.product_id)
            )
          })
        }
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }

      setSelectedIds([])
      setActionType('')
      setPendingAction(null)
    }
  }

  const handleCheckbox = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }

  const handleConfirmDeleteAll = async () => {
    if (pendingAction === 'delete-all') {
      await executeAction('delete-all')
    }
    setOpenDeleteAll(false)
  }
  if (loading) {
    return (
      <>
        <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
          <div className='container flex flex-col gap-[15px]'>
            <Skeleton variant="text" width={300} height={45} sx={{ bgcolor: 'grey.400' }}/>
            <form onSubmit={(event) => handleSubmit(event)} className='flex gap-[5px]'>
              <Skeleton variant="rectangular" width={178} height={36} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={72} height={36} sx={{ bgcolor: 'grey.400' }}/>
            </form>
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
                        <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <Skeleton variant="text" width={60} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <Skeleton variant="text" width={70} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <Skeleton variant="text" width={60} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <Skeleton variant="text" width={50} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>
                        <Skeleton variant="text" width={50} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align='center'>
                        <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton variant="rectangular" width={94} height={100} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align="left">
                        <Skeleton variant="text" width={369} height={37} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align="left">
                        <Skeleton variant="text" width={126} height={20} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton variant="rectangular" width={44} height={22} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton variant="rectangular" width={17} height={17} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='flex flex-col gap-[24px] w-[50%] border rounded-[5px] py-[20px] px-[24px]'>
                <Skeleton variant="text" width={400} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <div className='flex flex-col gap-[20px]'>
                  <div className='flex items-center justify-between'>
                    <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                  <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </div>
                <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                <div className='flex items-center gap-[12px]'>
                  <Skeleton variant="rectangular" width={315} height={46} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="rectangular" width={140} height={46} sx={{ bgcolor: 'grey.400' }}/>
                </div>
                <Skeleton variant="rectangular" width={467} height={62} sx={{ bgcolor: 'grey.400' }}/>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {cartDetail && (
        cartDetail.products.length > 0 ? (
          <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
            <div className='container flex flex-col gap-[15px]'>
              <div className='text-[30px] uppercase font-[600]'>Giỏ hàng của bạn</div>
              <form onSubmit={(event) => handleSubmit(event)} className='flex gap-[5px]'>
                <select
                  name="type"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className='cursor-pointer outline-none border rounded-[5px] border-[#9D9995] p-[5px]'
                >
                  <option disabled value={''}>-- Chọn hành động --</option>
                  <option value="delete-all">Xóa tất cả</option>
                  <option value="change-quantity">Thay đổi số lượng</option>
                </select>
                <button
                  type="submit"
                  className='border rounded-[5px] border-[#9D9995] p-[5px] bg-[#96D5FE]'
                >
                  Áp dụng
                </button>
                <Dialog
                  open={openDeleteAll}
                  onClose={handleClose}
                  aria-labelledby="delete-dialog-title"
                >
                  <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Bạn có chắc chắn muốn xóa {selectedIds.length} sản phẩm này khỏi giỏ hàng không?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button
                      onClick={handleConfirmDeleteAll}
                      color="error"
                      variant="contained"
                    >
                      Xóa
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
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
                            checked={
                              (cartDetail.products.length > 0) && (selectedIds.length === cartDetail.products.length) ? true : false
                            }
                            onChange={(event) => handleCheckAll(event.target.checked)}
                            {...label}
                            size="small"
                            sx={{ padding: 0 }}
                          />
                        </TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>STT</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hình ảnh</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên sản phẩm</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Đơn giá</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Số lượng</TableCell>
                        <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartDetail.products.map((cart, index) => {
                        const item = products.find((product) => product._id.toString() === cart.product_id.toString())
                        return (
                          item && (
                            <TableRow key={index}>
                              <TableCell align='center'>
                                <Checkbox
                                  checked={selectedIds.includes(item._id)}
                                  onChange={(event) => handleCheckbox(item._id, event.target.checked)}
                                  {...label}
                                  size="small"
                                  sx={{ padding: 0 }}
                                  value={item._id}
                                />
                              </TableCell>
                              <TableCell align="center">
                                {index + 1}
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
                                <div className='flex items-center justify-between gap-[5px]'>
                                  <span>
                                    {Math.floor((item.price * (100 - item.discountPercentage) / 100)).toLocaleString()}đ
                                  </span>
                                  <span className='line-through text-gray-400'>
                                    {item.price.toLocaleString()}đ
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                <input
                                  onChange={(event) => {
                                    const newQuantity = parseInt(event.target.value, 10)
                                    const updatedProducts = cartDetail.products.map((product) =>
                                      product.product_id === cart.product_id ? { ...product, quantity: newQuantity } : product
                                    )
                                    setCartDetail({ ...cartDetail, products: updatedProducts })
                                  }}
                                  className='border rounded-[5px] text-center'
                                  type='number'
                                  name='quantity'
                                  value={cart.quantity}
                                  data-id={cart.product_id}
                                  min={1}
                                  max={item.stock}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <button
                                  onClick={() => handleOpen(item._id)}
                                  className='text-red-500'>
                                  <RiDeleteBin5Line className='text-[17px] flex items-center justify-center'/>
                                </button>
                              </TableCell>
                            </TableRow>
                          )
                        )
                      })}
                      <Dialog
                        open={openDeleteOne}
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
                  <Link to={'/checkout'} className='nav-link border rounded-[10px] bg-[#00171F] py-[15px] text-white text-center text-[20px]'>Thanh toán</Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md'>
            <div className='container flex flex-col gap-[15px]'>
              <div className='text-[30px] uppercase font-[600]'>Giỏ hàng của bạn</div>
              <div>Giỏ hàng của bạn còn trống</div>
              <Link to={'/'} className='bg-[#0E0C28] text-white px-[10px] py-[5px] text-[20px] w-[8%] text-center border rounded-[5px]'>Mua ngay</Link>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default Cart