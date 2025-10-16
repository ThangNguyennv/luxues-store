import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  fetchCartAPI,
  fetchDeleteProductInCartAPI,
  fetchUpdateVariantAPI,
  fetchUpdateQuantityAPI
} from '~/apis/client/cart.api'
import type { CartInfoInterface, CartItemInterface } from '~/types/cart.type'
import { Table, TableHead, TableBody, TableCell, TableRow, TableContainer } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { Link } from 'react-router-dom'

const Cart = () => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)
  const [openDeleteOne, setOpenDeleteOne] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CartItemInterface | null>(null)
  const { dispatchAlert } = useAlertContext()
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    try {
      const cartRes = await fetchCartAPI()
      setCartDetail(cartRes.cartDetail)
    } catch (error) {
      console.error('Lỗi khi fetch giỏ hàng:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    refreshCart()
  }, [refreshCart])

  const handleOpenDeleteDialog = (item: CartItemInterface) => {
    setSelectedItem(item)
    setOpenDeleteOne(true)
  }

  const handleCloseDeleteDialog = () => {
    setSelectedItem(null)
    setOpenDeleteOne(false)
  }

  const totalBill = useMemo(() => {
    if (!cartDetail?.products) return 0
    return cartDetail?.products.reduce((acc, item) => {
      const priceNewForOneProduct =
    item.product_id.price * (100 - item.product_id.discountPercentage) / 100

      return acc + priceNewForOneProduct * item.quantity
    }, 0)
  }, [cartDetail])

  const handleDelete = async () => {
    if (!selectedItem) return
    const response = await fetchDeleteProductInCartAPI({
      productId: selectedItem.product_id._id as string,
      color: selectedItem.color,
      size: selectedItem.size
    })
    if (response.code === 204) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: response.message, severity: 'success' } })
      refreshCart()
      handleCloseDeleteDialog()
    } else {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Xóa thất bại!', severity: 'error' } })
    }
  }

  // === HÀM MỚI ĐỂ CẬP NHẬT COLOR/SIZE ===
  const handleVariantChange = async (
    item: CartItemInterface,
    newVariant: { color?: string; size?: string }
  ) => {
    if (!item) return

    const payload = {
      productId: item.product_id._id as string,
      oldColor: item.color,
      oldSize: item.size,
      newColor: newVariant.color ?? item.color,
      newSize: newVariant.size ?? item.size
    }

    try {
      const response = await fetchUpdateVariantAPI(payload)
      if (response.code === 200) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: response.message, severity: 'success' } })
        refreshCart() // Tải lại giỏ hàng để hiển thị thay đổi
      } else {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: response.message || 'Lỗi cập nhật', severity: 'error' } })
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Lỗi khi cập nhật phân loại', severity: 'error' } })
    }
  }

  const handleQuantityChange = async (item: CartItemInterface, newQuantity: number) => {
    if (newQuantity < 1 || !item.product_id || newQuantity > item.product_id.stock) return

    // Optimistic UI update
    if (cartDetail) {
      const updatedProducts = cartDetail.products.map(p =>
        (p.product_id._id === item.product_id._id && p.color === item.color && p.size === item.size)
          ? { ...p, quantity: newQuantity, totalPrice: (p.product_id?.['priceNew'] || 0) * newQuantity }
          : p
      )
      setCartDetail({ ...cartDetail, products: updatedProducts })
    }

    try {
      await fetchUpdateQuantityAPI({
        productId: item.product_id._id as string,
        color: item.color,
        size: item.size,
        quantity: newQuantity
      })
      // Tải lại để đảm bảo tổng tiền đúng, hoặc có thể tính lại ở client
      refreshCart()
    } catch (error) {
      refreshCart() // Rollback on error
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Lỗi cập nhật số lượng', severity: 'error' } })
    }
  }
  if (loading) { /* ... Skeleton UI không đổi ... */ }

  return (
    <>
      {cartDetail && cartDetail.products.length > 0 ? (
        <div className='p-8'>
          <div className='container mx-auto flex flex-col gap-6 mb-[100px]'>
            <h1 className='text-3xl font-bold uppercase'>Giỏ hàng của bạn</h1>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className="lg:col-span-2">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell>Phân loại</TableCell>
                        <TableCell align='right'>Đơn giá</TableCell>
                        <TableCell align='center'>Số lượng</TableCell>
                        <TableCell align='right'>Thành tiền</TableCell>
                        <TableCell align='center'>Xóa</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartDetail.products.map((item) => (
                        item.product_id && (
                          <TableRow key={`${item.product_id._id}-${item.color}-${item.size}`}>
                            <TableCell>
                              <div className="flex items-center gap-4">
                                <img src={item.product_id?.thumbnail} className='w-20 h-20 object-cover rounded'/>
                                <Link to={`/products/detail/${item.product_id?.slug}`} className="font-semibold hover:underline">
                                  {item.product_id?.title}
                                </Link>
                              </div>
                            </TableCell>

                            {/* === CỘT PHÂN LOẠI MỚI === */}
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                {item.product_id.colors.length > 0 && (
                                  <select
                                    value={item.color}
                                    onChange={(e) => handleVariantChange(item, { color: e.target.value })}
                                    className="p-1 border rounded text-sm"
                                  >
                                    {item.product_id.colors.map(color => (
                                      <option key={color.name} value={color.name}>{color.name}</option>
                                    ))}
                                  </select>
                                )}
                                {item.product_id.sizes.length > 0 && (
                                  <select
                                    value={item.size}
                                    onChange={(e) => handleVariantChange(item, { size: e.target.value })}
                                    className="p-1 border rounded text-sm"
                                  >
                                    {item.product_id.sizes.map(size => (
                                      <option key={size} value={size}>{size}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </TableCell>

                            <TableCell align="right">
                              <div className='flex flex-col'>
                                <span className="font-semibold">
                                  {Math.floor((item.product_id.price * (100 - item.product_id.discountPercentage) / 100)).toLocaleString('vi-VN')}đ
                                </span>
                                {item.product_id?.discountPercentage > 0 && (
                                  <span className="line-through text-gray-400 text-sm">{item.product_id?.price.toLocaleString('vi-VN')}đ</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <div className="flex items-center justify-center border rounded-full font-bold">
                                <button type="button" onClick={() => handleQuantityChange(item, item.quantity - 1)} className="px-3 py-1 text-lg">-</button>
                                <input
                                  className='w-12 h-full text-center bg-transparent outline-none'
                                  type='number' value={item.quantity} readOnly
                                />
                                <button type="button" onClick={() => handleQuantityChange(item, item.quantity + 1)} className="px-3 py-1 text-lg">+</button>
                              </div>
                            </TableCell>
                            <TableCell align="right" className="font-bold">{Math.floor((item.product_id.price * item.quantity * (100 - item.product_id.discountPercentage) / 100)).toLocaleString('vi-VN')}đ</TableCell>
                            <TableCell align="center">
                              <button onClick={() => handleOpenDeleteDialog(item)} className='text-red-500 hover:text-red-700'>
                                <RiDeleteBin5Line size={20}/>
                              </button>
                            </TableCell>
                          </TableRow>
                        )
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className='lg:col-span-1 flex flex-col gap-6 border rounded-lg p-6 h-fit shadow-md'>
                <h2 className='text-2xl font-bold'>Tóm tắt đơn hàng</h2>
                <div className='flex items-center justify-between'>
                  <span className="text-gray-600">Tổng tạm tính:</span>
                  <span className='font-semibold'>{totalBill.toLocaleString()}đ</span>
                </div>
                <div className='border-t pt-4 flex items-center justify-between'>
                  <span className="text-xl font-bold">Tổng tiền:</span>
                  <span className='font-bold text-2xl text-red-600'>{totalBill.toLocaleString()}đ</span>
                </div>
                <Link to={'/checkout'} className='w-full bg-black text-white font-bold py-3 px-6 rounded-lg text-center hover:bg-gray-800 transition-colors'>
                  Tiến hành thanh toán
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
      // Giao diện giỏ hàng trống
        <div className='text-center py-20'>
          <h1 className='text-3xl font-bold mb-4'>Giỏ hàng của bạn còn trống</h1>
          <p className="text-gray-500 mb-6">Hãy quay lại và chọn cho mình những sản phẩm ưng ý nhé.</p>
          <Link to={'/'} className='bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800'>Mua ngay</Link>
        </div>
      )
      }

      {/* Dialog xác nhận xóa  */}
      <Dialog open={openDeleteOne} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Cart