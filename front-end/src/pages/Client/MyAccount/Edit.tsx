import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { FaChevronDown, FaChevronUp, FaRegUser } from 'react-icons/fa'
import { IoIosNotifications } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
import { fetchEditInfoUserAPI, fetchInfoUserAPI } from '~/apis/client/user.api'
import type { UserDetailInterface, UserInfoInterface } from '~/types/user.type'
import { LiaFileInvoiceSolid } from 'react-icons/lia'
import { LuTicket } from 'react-icons/lu'
import { BsCoin } from 'react-icons/bs'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const EditMyAccountClient = () => {
  const [myAccount, setMyAccount] = useState<UserInfoInterface | null>(null)
  const { dispatchAlert } = useAlertContext()
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    fetchInfoUserAPI().then((response: UserDetailInterface) => {
      setMyAccount(response.accountUser)
    })
  }, [])

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!myAccount) return

    const formData = new FormData(event.currentTarget)
    formData.set('fullName', myAccount.fullName)
    formData.set('email', myAccount.email)
    formData.set('phone', myAccount.phone)

    const response = await fetchEditInfoUserAPI(formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        window.location.href = '/user/account/info' // Fix load lại trang sau!
      }, 2000)
    } else if (response.code === 409) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }
  return (
    <>
      {myAccount && (
        <div className="flex items-center justify-center gap-[70px] p-[70px] mt-[40px] mb-[80px]">
          <div className="container flex justify-around gap-[20px] p-[20px] shadow-lg">
            <div className='flex flex-col gap-[5px] text-[17px] font-[500] p-[10px]'>
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
                  <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Đổi mật khẩu</li>
                  <li className='hover:underline hover:text-[#00A7E6] cursor-pointer'>Những thiết lập riêng</li>
                </ul>
              </div>
              <div className='hover:underline hover:text-[#00A7E6] cursor-pointer flex items-center gap-[5px]'>
                <LiaFileInvoiceSolid />
                <span>Đơn Mua</span>
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
            <form
              onSubmit={(event) => handleSubmit(event)}
              className='w-[70%] flex justify-around gap-[15px] border rounded-[15px] p-[10px]'
              encType="multipart/form-data"
            >
              <div className='flex flex-col gap-[15px]'>
                <h1 className='text-[25px] font-[600]'>Chỉnh sửa hồ sơ của tôi</h1>
                <div className='flex flex-col gap-[10px]'>
                  <div className='form-group'>
                    <label htmlFor='fullName'>Họ và tên: </label>
                    <input
                      onChange={(event) => setMyAccount({ ...myAccount, fullName: event.target.value })}
                      type='text'
                      id='fullName'
                      name='fullName'
                      value={myAccount.fullName}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='email'>Email:</label>
                    <input
                      onChange={(event) => setMyAccount({ ...myAccount, email: event.target.value })}
                      type='email'
                      id='email'
                      name='email'
                      value={myAccount.email}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='phone'> Số điện thoại:</label>
                    <input
                      onChange={(event) => setMyAccount({ ...myAccount, phone: event.target.value })}
                      type='tel'
                      id='phone'
                      name='phone'
                      value={myAccount.phone}
                      required
                    />
                  </div>
                  <button
                    type='submit'
                    className='cursor-pointer border rounded-[5px] p-[7px] bg-[#525FE1] text-white text-center w-[40%]'
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-[5px] text-center items-center'>
                <label
                  htmlFor='avatar'
                  className='text-[20px] font-[600]'
                >
                    Ảnh đại diện:
                </label>
                <input
                  onChange={(event) => handleChange(event)}
                  ref={uploadImageInputRef}
                  type="file"
                  className=""
                  name="avatar"
                  accept="image/*"
                />
                <img
                  className='border rounded-[100%] w-[250px] h-[250px]'
                  ref={uploadImagePreviewRef}
                  src={myAccount.avatar}
                  alt="Avatar preview"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default EditMyAccountClient