import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchForgotPasswordAPI, fetchOTPPasswordAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const OTP = () => {
  const navigate = useNavigate()
  const [isSending, setIsSending] = useState(false)
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? '' // luôn là string

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.email.value
    const otp = form.otp.value
    const response = await fetchOTPPasswordAPI(email, otp)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/user/password/reset')
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
  const handleClick = async () => {
    if (isSending) return
    setIsSending(true)
    const response = await fetchForgotPasswordAPI(email)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
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
    setIsSending(false)
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
            <div className='text-[20px] font-[500]'>Lấy lại mật khẩu</div>
            <input
              type='email'
              name='email'
              placeholder="Email"
              className="border rounded-[5px] p-[10px]"
              value={email}
              readOnly
            />
            <input
              type='text'
              name='otp'
              placeholder="Nhập mã OTP"
              className="border rounded-[5px] p-[10px]"
              required
            />
            <div
              onClick={handleClick}
              className={`hover:underline text-[14px] font-[400] text-[#0A033C] cursor-pointer flex items-center justify-start ${isSending ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isSending ? 'Đang gửi...' : 'Gửi lại mã OTP?'}
            </div>
            <button
              type='submit'
              className='bg-[#192335] border rouned-[5px] p-[10px] text-white cursor-pointer'
            >
              Xác nhận mã OTP
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default OTP