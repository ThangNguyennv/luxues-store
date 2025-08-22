import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchRegisterAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { IoEye, IoEyeOff } from 'react-icons/io5'

const RegisterClient = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = event.currentTarget
    const fullName = form.fullName.value
    const email = form.email.value
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value
    const response = await fetchRegisterAPI(fullName, email, password, confirmPassword)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/user/login')
      }, 2000)
    } else if (response.code === 401) {
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
            <div className='text-[20px] font-[500]'>Đăng ký</div>
            <input
              type='text'
              name='fullName'
              placeholder="Họ và tên"
              className="border rounded-[5px] p-[10px]"
              required
            />
            <input
              type='email'
              name='email'
              placeholder="Email"
              className="border rounded-[5px] p-[10px]"
              required
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
            {/* Ô nhập mật khẩu có icon con mắt */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Xác nhận lại mật khẩu"
                className="border rounded-[5px] p-[10px] w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>
            <button
              type='submit'
              className='bg-[#192335] border rouned-[5px] p-[10px] text-white cursor-pointer'
            >
              Đăng ký
            </button>
            <div className="flex items-center justify-center gap-[5px]">
              <p className='text-[15px]'>Bạn đã có tài khoản?</p>
              <Link
                to={'/user/login'}
                className='text-[#525FE1] font-[600] hover:underline'
              >
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RegisterClient