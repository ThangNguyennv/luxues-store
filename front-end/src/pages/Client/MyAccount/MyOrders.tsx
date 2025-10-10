import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useOrderContext } from '~/contexts/client/OrderContext'
import { FaCircleCheck } from 'react-icons/fa6'
import { BsClockFill } from 'react-icons/bs'
import { MdLocalShipping } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import FormatDateTime from '~/components/admin/Moment/FormatDateTime'
import OrderProgress from '~/helpers/OrderStatusProps'

const MyOrders = () => {
  const { stateOrder, fetchOrder, dispatchOrder } = useOrderContext()
  console.log('🚀 ~ MyOrders.tsx ~ MyOrders ~ stateOrder:', stateOrder)
  const { orders, pagination, filterOrder, keyword, allOrders } = stateOrder
  const { dispatchAlert } = useAlertContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actionType, setActionType] = useState('')
  const [open, setOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const currentStatus = searchParams.get('status') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''

  useEffect(() => {
    fetchOrder({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentStatus, currentPage, currentKeyword, currentSortKey, currentSortValue, fetchOrder])

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

  const reloadData = (): void => {
    fetchOrder({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }
  const statusToStep = {
    PENDING: 0,
    TRANSPORTING: 1,
    CONFIRMED: 2,
    CANCELED: 3
  }

  return (
    <div className="flex flex-col gap-[15px] flex-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-[22px] font-[600]">Đơn hàng của tôi</h2>
          <span className="text-[14px] text-[#555]">Theo dõi và quản lý lịch sử đơn hàng của bạn</span>
        </div>
        <div className="flex items-center justify-center gap-[10px]">
          <div className="border rounded-[5px]">Trạng thái đơn hàng</div>
          <div className="border rounded-[5px]">Mốc thời gian</div>
        </div>
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
                    <FormatDateTime time={order.createdAt}/>
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
                    <span className='font-[600]'>01/01/2025</span>
                  </div>
                )}
                {order.status == 'CONFIRMED' && (
                  <div className='flex items-center gap-[5px]'>
                    <span>Đã nhận hàng:</span>
                    <span className='font-[600]'>03/01/2025</span>
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
                        <button className='text-white font-[600] border rounded-[5px] bg-red-500 p-[5px] text-[14px]'>Đánh giá</button>
                        <button className='text-black font-[600] border rounded-[5px]  p-[5px] text-[14px]'>Yêu cầu trả hàng/hoàn tiền</button>
                        <select className='outline-none border rounded-[5px] p-[5px] text-[14px] font-[600]'>
                          <option disabled>Thêm</option>
                          <option>Liên hệ shop</option>
                          <option>Mua lại</option>
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
                  <button className='text-white font-[600] border rounded-[5px] bg-red-500 p-[5px] text-[14px]'>Hủy đơn hàng</button>
                )}
                {order.status == 'CANCELED' && (
                  <div className='flex items-center justify-center gap-[5px]'>
                    <button className='text-white font-[600] border rounded-[5px] bg-red-500 p-[5px] text-[16px]'>Mua lại</button>
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
    </div>
  )
}

export default MyOrders