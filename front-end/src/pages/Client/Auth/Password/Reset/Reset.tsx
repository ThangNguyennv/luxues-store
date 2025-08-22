import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchResetPasswordOTPAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const Reset = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = event.currentTarget
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value
    const response = await fetchResetPasswordOTPAPI(password, confirmPassword)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/user/login')
      }, 1500)
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
            <div className='text-[20px] font-[500]'>Đổi mật khẩu</div>
            <input
              type='password'
              name='password'
              placeholder="Mật khẩu"
              className="border rounded-[5px] p-[10px]"
              required
            />
            <input
              type='password'
              name='confirmPassword'
              placeholder="Xác nhận lại mật khẩu"
              className="border rounded-[5px] p-[10px]"
              required
            />
            <button
              type='submit'
              className='bg-[#192335] border rouned-[5px] p-[10px] text-white cursor-pointer'
            >
              Đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Reset