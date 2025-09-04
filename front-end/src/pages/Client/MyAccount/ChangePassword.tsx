import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchChangePasswordInfoUserAPI, fetchInfoUserAPI } from '~/apis/client/user.api'
import type { UserDetailInterface, UserInfoInterface } from '~/types/user.type'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import Skeleton from '@mui/material/Skeleton'

const ChangePassword = () => {
  const [myAccount, setMyAccount] = useState<UserInfoInterface | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  useEffect(() => {
    fetchInfoUserAPI().then((response: UserDetailInterface) => {
      setMyAccount(response.accountUser)
    })
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!myAccount) return

    const form = event.currentTarget
    const currentPassword = form.currentPassword.value
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value
    const response = await fetchChangePasswordInfoUserAPI(currentPassword, password, confirmPassword)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/user/account/info')
      }, 2000)
    } else if (response.code === 400) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  return (
    <>
      {myAccount ? (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className='w-[70%] flex items-center justify-center gap-[15px] border rounded-[15px] p-[10px]'
          encType="multipart/form-data"
        >
          <div className='flex flex-col w-[40%] gap-[15px]'>
            <h1 className='text-[25px] font-[600] text-center'>Thay đổi mật khẩu tài khoản</h1>
            <div className='flex flex-col gap-[10px]'>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  placeholder="Mật khẩu hiện tại"
                  className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showCurrentPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Mật khẩu mới"
                  className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Xác nhận lại mật khẩu"
                  className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              <div className='flex items-center justify-center'>
                <button
                  type='submit'
                  className='cursor-pointer border rounded-[5px] p-[7px] bg-[#525FE1] text-white text-center w-[20%] text-[14px]'
                >
                Cập nhật
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className='w-[70%] flex items-center justify-center gap-[15px] border rounded-[15px] p-[10px]'>
          <div className='flex flex-col w-[40%] gap-[15px]'>
            <Skeleton variant="text" width={410} height={38} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex flex-col gap-[10px]'>
              <Skeleton variant="rectangular" width={410} height={46} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={410} height={46} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={410} height={46} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex items-center justify-center'>
                <Skeleton variant="rectangular" width={82} height={37} sx={{ bgcolor: 'grey.400' }}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChangePassword