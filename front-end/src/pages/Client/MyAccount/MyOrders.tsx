import { useEffect, useState, type ChangeEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useOrderContext } from '~/contexts/client/OrderContext'
import { FaCircleCheck, FaRegStar, FaStar } from 'react-icons/fa6'
import { BsClockFill } from 'react-icons/bs'
import { MdLocalShipping } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import FormatDateTime from '~/components/admin/Moment/FormatDateTime'
import OrderProgress from '~/pages/client/MyAccount/OrderProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { fetchCancelOrder } from '~/apis/client/user.api'
import type { OrderStatus } from '~/types/order.type'
import { useCart } from '~/contexts/client/CartContext'
import Pagination from '~/components/admin/Pagination/Pagination'
import { FaFilter } from 'react-icons/fa'
import { formatDateIntl } from '~/helpers/formatDateIntl'
import { submitReviewAPI } from '~/apis/client/product.api'

const MyOrders = () => {
  const { stateOrder, fetchOrder, dispatchOrder } = useOrderContext()
  const { orders, pagination } = stateOrder
  const { dispatchAlert } = useAlertContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionType, setActionType] = useState('')
  const [open, setOpen] = useState(false)
  const currentStatus = searchParams.get('status') || ''
  const currentDate = searchParams.get('date') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''
  const [typeStatusOrder, setTypeStatusOrder] = useState(currentStatus || '')
  const { addToCart } = useCart()

  // === THÊM STATE CHO POPUP ĐÁNH GIÁ ===
  const [openReview, setOpenReview] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productToReview, setProductToReview] = useState<any | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [reviewImages, setReviewImages] = useState<File[]>([])
  const [reviewPreviews, setReviewPreviews] = useState<string[]>([])

  useEffect(() => {
    fetchOrder({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue,
      date: currentDate
    })
  }, [currentStatus, currentPage, currentKeyword, currentSortKey, currentSortValue, currentDate, fetchOrder])

  const updateSearchParams = (key: string, value: string): void => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }

    // Nếu xóa sortKey hoặc sortValue → xóa cả 2
    if ((key === 'sortKey' || key === 'sortValue') && !value) {
      newParams.delete('sortKey')
      newParams.delete('sortValue')
    }

    setSearchParams(newParams)
  }

  // const reloadData = (): void => {
  //   fetchOrder({
  //     status: currentStatus,
  //     page: currentPage,
  //     keyword: currentKeyword,
  //     sortKey: currentSortKey,
  //     sortValue: currentSortValue
  //   })
  // }

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }

  const handleCancel = async () => {
    if (!selectedId) return

    const response = await fetchCancelOrder(selectedId)
    if (response.code === 200) {
      const updatedOrders = orders.map(order =>
        order._id === selectedId
          ? { ...order, status: 'CANCELED' as OrderStatus }
          : order
      )
      dispatchOrder({
        type: 'SET_DATA',
        payload: {
          orders: updatedOrders
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

  const handleBuyBack = async (productId: string, quantity: number) => {
    try {
      await addToCart(productId, quantity)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Mua lại đơn hàng thành công!', severity: 'success' }
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Lỗi khi mua lại', severity: 'error' }
      })
    }
  }

  const handleLinkToContactShop = () => {

  }

  const handleBuyBackAfterConfirming = (e: ChangeEvent<HTMLSelectElement>, productId: string, quantity: number) => {
    const value = e.target.value
    setActionType(value)
    if (value === 'contact-shop') {
      handleLinkToContactShop()
    } else if (value === 'buy-back') {
      handleBuyBack(productId, quantity)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const selectedDate = event.currentTarget.selectedDate.value

    const newParams = new URLSearchParams(searchParams)

    const setParam = (key: string, value: string) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    }

    setParam('status', typeStatusOrder)
    setParam('date', selectedDate)
    newParams.set('page', '1') // Luôn quay về trang 1 khi lọc
    setSearchParams(newParams)
  }


  const statusToStep = {
    PENDING: 0,
    TRANSPORTING: 1,
    CONFIRMED: 2,
    CANCELED: 3
  }

  // === CÁC HÀM XỬ LÝ CHO POPUP ===

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenReview = (product: any, orderId: string) => {
    setProductToReview({ ...product, orderId }) // Lưu cả orderId nếu cần
    setOpenReview(true)
  }

  const handleCloseReview = () => {
    setOpenReview(false)
    // Reset state để lần sau mở lại không bị dính dữ liệu cũ
    setProductToReview(null)
    setReviewRating(5)
    setReviewContent('')
    setReviewImages([])
    setReviewPreviews([])
  }

  const handleReviewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setReviewImages(prev => [...prev, ...newFiles])
      setReviewPreviews(prev => [...prev, ...newPreviews])
    }
  }

  const handleRemoveReviewImage = (index: number) => {
    URL.revokeObjectURL(reviewPreviews[index])
    setReviewImages(prev => prev.filter((_, i) => i !== index))
    setReviewPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleReviewSubmit = async () => {
    if (!productToReview || reviewRating === 0) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn số sao!', severity: 'error' } })
      return
    }

    const formData = new FormData()
    formData.append('rating', String(reviewRating))
    formData.append('content', reviewContent)
    reviewImages.forEach(file => {
      formData.append('images', file)
    })
    if (productToReview.color) {
      formData.append('color', productToReview.color)
    }
    if (productToReview.size) {
      formData.append('size', productToReview.size)
    }
    try {
      const response = await submitReviewAPI(productToReview.product_id, formData)
      if (response.code === 201) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Đánh giá đã được gửi!', severity: 'success' } })
        handleCloseReview()
        // Cập nhật lại trạng thái đơn hàng (ví dụ: đã đánh giá) nếu cần
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Có lỗi xảy ra', severity: 'error' } })
    }
  }

  return (
    <div className="flex flex-col gap-[15px] flex-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-[22px] font-[600]">Đơn hàng của tôi</h2>
          <span className="text-[14px] text-[#555]">Theo dõi và quản lý lịch sử đơn hàng của bạn</span>
        </div>
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex items-center justify-center gap-[10px]"
        >
          <div className="flex items-center justify-center gap-[5px] border rounded-[5px] p-[5px]">
            <FaFilter />
            <select
              name='type'
              defaultValue={typeStatusOrder}
              onChange={(e) => setTypeStatusOrder(e.target.value)}
              className='outline-none'
            >
              <option disabled>Trạng thái đơn</option>
              <option value={''}>Tất cả</option>
              <option value={'PENDING'}>Đang xử lý</option>
              <option value={'TRANSPORTING'}>Đang vận chuyển</option>
              <option value={'CONFIRMED'}>Đã hoàn thành</option>
              <option value={'CANCELED'}>Đã hủy</option>
            </select>
          </div>
          <div className="flex items-center justify-center gap-[5px] border rounded-[5px] p-[4px]">
            <input
              type='date'
              name='selectedDate'
              defaultValue={currentDate}
            />
          </div>
          <button type='submit' className='border rounded-[5px] p-[4px] bg-blue-500 text-amber-100'>Áp dụng</button>
        </form>
      </div>
      {orders && orders.length > 0 ? (
        orders.map((order, index) => (
          <div className="flex flex-col gap-[10px] border rounded-[5px] border-blue-100 shadow-xl p-[15px]" key={index}>
            <div className="flex items-center justify-between">
              <div className='flex items-center justify-center gap-[10px]'>
                <div className='flex flex-col gap-[5px]'>
                  <span className='font-[700] text-[17px]'>Mã đơn: {order._id}</span>
                  <div className='flex items-center gap-[5px]'>
                    <span>Đặt hàng vào:</span>
                    <b><FormatDateTime time={order.createdAt}/></b>
                  </div>
                </div>
                {
                  order.status == 'PENDING' ?
                    <div className="text-[#FFAB19] font-[600] border rounded-[10px] bg-amber-200 p-[4px] flex items-center justify-center gap-[4px] text-[14px]">
                      <BsClockFill />
                      <span>Đang xử lý</span>
                    </div> :
                    order.status == 'TRANSPORTING' ?
                      <div className="text-[#2F57EF] font-[600] border rounded-[10px] bg-blue-200 p-[4px] flex items-center justify-center gap-[4px] text-[14px]">
                        <MdLocalShipping />
                        <span>Đang vận chuyển</span>
                      </div> :
                      order.status == 'CONFIRMED' ?
                        <div className="text-green-500 font-[600] border rounded-[10px] bg-emerald-200 p-[4px] flex items-center justify-center gap-[4px] text-[14px]">
                          <FaCircleCheck />
                          <span>Đã hoàn thành</span>
                        </div> :
                        <div className="text-[#BC3433] font-[600] border rounded-[10px] bg-red-200 p-[4px] flex items-center justify-center gap-[4px] text-[14px]">
                          <MdOutlineCancel />
                          <span>Đã hủy</span>
                        </div>
                }
              </div>
              <div className='flex items-center justify-center gap-[10px]'>
                <div className='flex flex-col items-center gap-[10px]'>
                  <span>Tổng số tiền:</span>
                  <span className='font-[600]'>{order.amount.toLocaleString()}đ</span>
                </div>
                <Link
                  to={`/checkout/success/${order._id}`}
                  className='text-blue-600 hover:underline'
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-[10px]'>
              {order.products && order.products.length > 0 && (
                order.products.map((product, idx) => (
                  <div className='flex items-center gap-[5px]' key={idx}>
                    <img src={product.thumbnail} className='w-[100px] h-[100px] object-contain'/>
                    <div className='flex flex-col gap-[5px]'>
                      <span className='line-clamp-1 font-[600]'>{product.title}</span>
                      <span>x{product.quantity}</span>
                      <div className='flex items-center gap-[5px]'>
                        {product.discountPercentage > 0 && (
                          <span className='line-through'>{product.price.toLocaleString()}đ</span>
                        )}
                        <span>
                          {Math.floor((product.price * (100 - product.discountPercentage) / 100)).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                )))}
            </div>
            <div className='flex flex-col gap-[10px]'>
              <div>
                {order.status == 'TRANSPORTING' && (
                  <div className='flex items-center gap-[5px]'>
                    <span>Ngày giao hàng dự kiến:</span>
                    <span className='font-[600]'>
                      {formatDateIntl(order.estimatedDeliveryDay)}
                    </span>
                  </div>
                )}
                {order.status == 'CONFIRMED' && (
                  <div className='flex items-center gap-[5px]'>
                    <span>Ngày nhận hàng:</span>
                    <span className='font-[600]'>
                      {formatDateIntl(order.estimatedConfirmedDay)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                {
                  order.status != 'CANCELED' && order.status != 'CONFIRMED' && (
                    <OrderProgress currentStep={statusToStep[order.status] ?? 0} />
                  )
                }
                {
                  order.status == 'CONFIRMED' && (
                    <>
                      <OrderProgress currentStep={statusToStep[order.status] ?? 0} />
                      <div className='flex items-center justify-end gap-[5px]'>
                        {/* Đánh giá từng sản phẩm */}
                        {order.products.map(product => (
                          <button
                            key={product.product_id}
                            onClick={() => handleOpenReview(product, order._id)}
                            className='text-white font-[600] border rounded-[5px] bg-red-500 p-[5px] text-[14px]'
                          >
                            Đánh giá
                          </button>
                        ))}
                        <button className='text-black font-[600] border rounded-[5px]  p-[5px] text-[14px]'>Yêu cầu trả hàng/hoàn tiền</button>
                        <select
                          value={actionType}
                          onChange={(e) => {
                            {order.products.forEach((product) => {
                              handleBuyBackAfterConfirming(e, product.product_id, product.quantity)
                            })}
                          }}
                          className='outline-none border rounded-[5px] p-[5px] text-[14px] font-[600]'
                        >
                          <option disabled value={''}>-- Thêm --</option>
                          <option value={'contact-shop'}>
                            Liên hệ shop
                          </option>
                          <option value={'buy-back'}>
                            Mua lại
                          </option>
                        </select>
                      </div>
                    </>
                  )
                }
              </div>
            </div>
            <div className='flex items-center justify-end'>
              <div>
                {order.status == 'PENDING' && (
                  <button
                    onClick={() => handleOpen(order._id)}
                    className='text-white font-[600] border rounded-[5px] bg-red-500 p-[5px] text-[14px]'
                  >
                    Hủy đơn hàng
                  </button>
                )}
                {order.status == 'CANCELED' && (
                  <div className='flex items-center justify-center gap-[5px]'>
                    <button
                      onClick={() => {
                        order.products.forEach((product) => {
                          handleBuyBack(product.product_id, product.quantity)
                        })
                      }}
                      className='text-white font-[600] border rounded-[5px] bg-red-500 p-[5px] text-[16px]'
                    >
                      Mua lại
                    </button>
                    <button className='text-black font-[600] border rounded-[5px] p-[5px] text-[16px]'>Liên hệ shop</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='text-red'>Không tồn tại đơn hàng nào!</div>
      )}
      <Pagination
        pagination={pagination}
        handlePagination={(page) => updateSearchParams('page', (page).toString())}
        handlePaginationPrevious={(page) => updateSearchParams('page', (page - 1).toString())}
        handlePaginationNext={(page) => updateSearchParams('page', (page + 1).toString())}
        items={orders}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận hủy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đơn hàng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* === THÊM POPUP ĐÁNH GIÁ VÀO CUỐI COMPONENT === */}
      <Dialog open={openReview} onClose={handleCloseReview} fullWidth maxWidth="sm">
        <DialogTitle>Đánh giá sản phẩm</DialogTitle>
        <DialogContent>
          {productToReview && (
            <div className="flex flex-col gap-4 py-4">
              {/* Card thông tin sản phẩm */}
              <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                <img src={productToReview.thumbnail} className="w-16 h-16 object-cover rounded"/>
                <span className="font-semibold">{productToReview.title}</span>
              </div>

              {/* Chọn số sao */}
              <div className="flex items-center justify-center gap-2 text-3xl text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} onClick={() => setReviewRating(index + 1)} className="cursor-pointer">
                    {index < reviewRating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>

              {/* Mô tả */}
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={4}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé!"
                className="w-full p-2 border rounded-md"
              ></textarea>

              {/* Upload ảnh */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="review-images-upload"
                  className="hidden"
                  onChange={handleReviewImageChange}
                />
                <label htmlFor="review-images-upload" className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-md">
                  + Thêm hình ảnh
                </label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {reviewPreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img src={src} className="w-full h-20 object-cover rounded"/>
                      <button onClick={() => handleRemoveReviewImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReview}>Hủy</Button>
          <Button onClick={handleReviewSubmit} variant="contained">Gửi đánh giá</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default MyOrders