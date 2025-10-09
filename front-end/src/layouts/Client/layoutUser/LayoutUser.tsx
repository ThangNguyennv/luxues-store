import { useState } from 'react'
import { BsCoin } from 'react-icons/bs'
import { FaChevronDown, FaChevronUp, FaRegUser } from 'react-icons/fa'
import { IoIosNotifications } from 'react-icons/io'
import { LiaFileInvoiceSolid } from 'react-icons/lia'
import { LuTicket } from 'react-icons/lu'
import { Link, Outlet } from 'react-router-dom'


const LayoutUser = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-center gap-[70px] pb-[70px] mt-[40px] mb-[80px]">
        <div className="container flex justify-between gap-[20px] p-[20px] shadow-lg">
          <div className='flex flex-col gap-[5px] text-[17px] font-[500] p-[10px] w-[15%]'>
            <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[4px]'>
              <IoIosNotifications />
              <p>Thông Báo</p>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='flex items-center gap-[5px] cursor-pointer'
            >
              <FaRegUser />
              <span className='hover:underline hover:text-[#00A7E6]'>Tài Khoản Của Tôi</span>
              <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>
            <div className={`
                  overflow-hidden transition-all duration-300
                  ${isOpen ? 'max-h-40 mt-2' : 'max-h-0'}
                `}
            >
              <ul className='flex flex-col gap-2 ml-[22px]'>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>
                  <Link to={'/user/account/info'}>Hồ sơ</Link>
                </li>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Ngân hàng</li>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Địa chỉ</li>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>
                  <Link to={'/user/account/info/change-password'}>Đổi mật khẩu</Link>
                </li>
                <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Những thiết lập riêng</li>
              </ul>
            </div>
            <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px]'>
              <LiaFileInvoiceSolid />
              <Link to={'/user/my-orders'}>Đơn Mua</Link>
            </div>
            <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px]'>
              <LuTicket />
                Kho Voucher
            </div>
            <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px]'>
              <BsCoin />
                Luxues Xu
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default LayoutUser