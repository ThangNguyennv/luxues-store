import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/admin/Order/useDetail'

const DetailOrder = () => {
  const {
    orderDetail,
    id
  } = useDetail()

  return (
    <>
      {orderDetail ? (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[17px]'>
          <div className='text-[24px] font-[600] text-[#00171F]'>
            Chi tiết đơn hàng
          </div>
          <div className='flex gap-[20px]'>
            <div className='flex flex-col gap-[15px]'>
              <div className='flex flex-col gap-[15px]'>
                {orderDetail.products.length > 0 && (
                  orderDetail.products.map((product, index) => (
                    <div className='flex flex-col gap-[10px] border rounded-[5px] p-[10px]' key={index}>
                      <div>
                        <b>Tên sản phẩm: </b>
                        {product.title}
                      </div>
                      <div>
                        <b>Giá: </b>
                        {product.price.toLocaleString('vi-VN')}đ
                      </div>
                      <div>
                        <b>Giảm giá: </b>
                        {product.discountPercentage}%
                      </div>
                      <div>
                        <b>Còn lại: </b>
                        {product.quantity}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div>
                <b>Trạng thái: </b>
                {
                  orderDetail.status === 'confirmed' ?
                    <span className="text-green-500 font-[600]">Đã xác nhận</span> :
                    <span className="text-red-500 font-[600]">Chờ duyệt</span>
                }
              </div>
              <Link
                to={`/admin/orders/edit/${id}`}
                className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[20%] text-center text-[14px]'
              >
                Chỉnh sửa
              </Link>
            </div>
            <div className='flex flex-col gap-[15px]'>
              <div className='font-[600] text-[20px]'>Thông tin người đặt hàng</div>
              <div className='flex flex-col gap-[10px]'>
                <div>
                  <b>Họ và tên: </b>
                  {orderDetail.userInfo.fullName}
                </div>
                <div>
                  <b>Số điện thoại: </b>
                  {orderDetail.userInfo.phone}
                </div>
                <div>
                  <b>Địa chỉ: </b>
                  {orderDetail.userInfo.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[17px]'>
            <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex gap-[20px]'>
              <div className='flex flex-col gap-[15px]'>
                <div className='flex flex-col gap-[15px]'>
                  <div className='flex flex-col gap-[10px] border rounded-[5px] p-[10px]'>
                    <Skeleton variant="text" width={403} height={26} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="text" width={100} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="text" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="text" width={70} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                </div>
                <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>

                <Link
                  to={`/admin/orders/edit/${id}`}
                  className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[20%] text-center text-[14px]'
                >
                Chỉnh sửa
                </Link>
              </div>
              <div className='flex flex-col gap-[15px]'>
                <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
                <div className='flex flex-col gap-[10px]'>
                  <Skeleton variant="text" width={220} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={231} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={210} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DetailOrder