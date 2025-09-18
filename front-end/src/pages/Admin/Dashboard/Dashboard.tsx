import { useDashboard } from '~/hooks/admin/dashboard/useDashboard'
import { FaProductHunt } from 'react-icons/fa'
import { PiUserListBold } from 'react-icons/pi'
import { RiBillLine } from 'react-icons/ri'
import { MdCheckCircleOutline } from 'react-icons/md'

const Dashboard = () => {
  const {
    statistic
  } = useDashboard()

  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#BC3433] m-[20px]">Thống kê</h1>

      <div className='grid grid-cols-4 gap-[10px] p-[5px] text-amber-50'>
        <div className='border rounded-[5px] p-[15px] gap-[25px] flex items-center justify-center bg-[#2F57EF]'>
          <PiUserListBold className='text-[30px]'/>
          <div className='flex flex-col gap-[5px]'>
            <b>Lượng truy cập</b>
            <b>{statistic.user.total}</b>
          </div>
        </div>
        <div className='border rounded-[5px] p-[15px] gap-[25px] flex items-center justify-center bg-[#525FE1]'>
          <FaProductHunt className='text-[30px]'/>
          <div className='flex flex-col gap-[5px]'>
            <b>Sản phẩm</b>
            <b>{statistic.product.total}</b>
          </div>
        </div>
        <div className='border rounded-[5px] p-[15px] gap-[25px] flex items-center justify-center bg-[#18BA2A]'>
          <RiBillLine className='text-[30px]'/>
          <div className='flex flex-col gap-[5px]'>
            <b>Đơn hàng</b>
            <b>{statistic.order.total}</b>
          </div>
        </div>
        <div className='border rounded-[5px] p-[15px] gap-[25px] flex items-center justify-center bg-[#FFAB19]'>
          <MdCheckCircleOutline className='text-[30px]'/>
          <div className='flex flex-col gap-[5px]'>
            <b>Doanh thu</b>
            <b>{statistic.revenue.total.toLocaleString()}đ</b>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard