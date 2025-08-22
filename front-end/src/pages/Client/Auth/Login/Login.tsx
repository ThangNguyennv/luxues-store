import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchLoginAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { IoEye, IoEyeOff } from 'react-icons/io5'

const LoginClient = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.email.value
    const password = form.password.value
    const response = await fetchLoginAPI(email, password)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } else if (response.code === 401) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    } else if (response.code == 403) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    } else if (response.code === 400) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }
  return (
    <>
      <div className="flex items-center justify-center gap-[70px] p-[70px] mt-[40px] mb-[80px] bg-[#96D5FE]">
        <div className='flex flex-col gap-[10px] text-center text-[20px]'>
          <div className='font-[600]'>LUXUES STORE</div>
          <div>Shop thời trang được yêu thích nhất tại Việt Nam</div>
        </div>
        <div className="w-[30%]">
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[15px] text-center border rounded-[5px] p-[20px] bg-amber-50"
          >
            <div className='text-[20px] font-[500]'>Đăng nhập</div>
            <input
              type='email'
              name='email'
              placeholder="Email"
              className="border rounded-[5px] p-[10px]"
            />
            {/* Ô nhập mật khẩu có icon con mắt */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu"
                className="border rounded-[5px] p-[10px] w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>
            <button
              type='submit'
              className='bg-[#192335] border rouned-[5px] p-[10px] text-white cursor-pointer'
            >
              Đăng nhập
            </button>
            <Link
              to={'/user/password/forgot'}
              className='hover:underline text-[14px] text-[#003459] flex items-center justify-start'
            >
              Quên mật khẩu?
            </Link>
            <div className="flex items-center justify-center gap-[5px]">
              <p className='text-[15px]'>Bạn mới biết đến LUXUES STORE?</p>
              <Link
                to={'/user/register'}
                className='text-[#525FE1] font-[600] hover:underline'
              >
                Đăng ký
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginClient