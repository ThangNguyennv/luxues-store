import { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp, FaRegUser } from 'react-icons/fa'
import { IoIosNotifications } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { fetchInfoUserAPI } from '~/apis/client/user.api'
import type { UserDetailInterface, UserInfoInterface } from '~/types/user.type'
import { LiaFileInvoiceSolid } from 'react-icons/lia'
import { LuTicket } from 'react-icons/lu'

const MyAccountClient = () => {
  const [myAccount, setMyAccount] = useState<UserInfoInterface | null>(null)
  useEffect(() => {
    fetchInfoUserAPI().then((response: UserDetailInterface) => {
      setMyAccount(response.accountUser)
    })
  }, [])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {myAccount && (
        <div className="flex items-center justify-center gap-[70px] p-[70px] mt-[40px] mb-[80px]">
          <div className="container border rounded-[5px] flex justify-around gap-[20px] p-[20px] shadow-lg">
            <div className='flex flex-col gap-[5px] text-[17px] font-[500]'>
              <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[4px]'>
                <IoIosNotifications />
                <p>Thông báo</p>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-[5px] cursor-pointer'
              >
                <FaRegUser />
                <span className='hover:underline hover:text-[#00A7E6]'>Tài khoản của tôi</span>
                <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
              </button>
              <div className={`
                  overflow-hidden transition-all duration-300
                  ${isOpen ? 'max-h-40 mt-2' : 'max-h-0'}
                `}
              >
                <ul className='flex flex-col gap-2 ml-[22px]'>
                  <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Hồ sơ</li>
                  <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Địa chỉ</li>
                  <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Đổi mật khẩu</li>
                  <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Thông tin cá nhân</li>
                </ul>
              </div>
              <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px]'>
                <LiaFileInvoiceSolid />
                <span>Đơn mua</span>
              </div>
              <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px]'>
                <LuTicket />
                Kho Voucher
              </div>
            </div>
            <div className='w-[70%] flex justify-around gap-[15px]'>
              <div className='flex flex-col gap-[15px]'>
                <div>
                  <h1 className='text-[25px] font-[600]'>Hồ sơ của tôi</h1>
                  <p className='text-[20px] font-[500]'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>
                <div className='flex flex-col gap-[10px]'>
                  <div>
                    Họ và tên: <b>{myAccount.fullName}</b>
                  </div>
                  <div>
                    Email: <b>{myAccount.email}</b>
                  </div>
                  <div>
                    Số điện thoại: <b>{myAccount.phone}</b>
                  </div>
                  <Link
                    to={'/user/info/edit'}
                    className='border rounded-[5px] p-[7px] bg-[#525FE1] text-white text-center w-[30%]'
                  >
                    Chỉnh sửa
                  </Link>
                </div>
              </div>
              <div className='flex flex-col gap-[5px] text-center'>
                <span className='text-[20px] font-[600]'>Ảnh đại diện:</span>
                <img
                  className='border rounded-[100%] w-[250px] h-[250px]'
                  src={myAccount.avatar}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MyAccountClient