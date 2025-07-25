import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLoginAPI } from '~/apis'
import backgroundLogin from '~/assets/images/Home/image-login.png'
import { AlertToast } from '~/components/Alert/Alert'

const Login = () => {
  const navigate = useNavigate()
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.email.value
    const password = form.password.value
    try {
      const res = await fetchLoginAPI(email, password)
      if (res.code === 200) {
        setAlertMessage('Đăng nhập thành công!')
        setAlertSeverity('success')
        setAlertOpen(true)

        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1500)
      } else if (res.code === 400) {
        setAlertMessage('Email không tồn tại!')
        setAlertSeverity('error')
        setAlertOpen(true)
      } else if (res.code === 401) {
        setAlertMessage('Tài khoản hoặc mật khẩu không chính xác')
        setAlertSeverity('error')
        setAlertOpen(true)
      } else if (res.code == 402) {
        setAlertMessage('Tài khoản đã bị khóa!')
        setAlertSeverity('error')
        setAlertOpen(true)
      } else if (res.code === 404 || res.code === 405) {
        setAlertMessage('Vui lòng đăng nhập lại tài khoản mật khẩu!')
        setAlertSeverity('error')
        setAlertOpen(true)
      }
    } catch (error) {
      alert('Lỗi!' + error)
    }
  }

  return (
    <>
      <AlertToast
        open={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
      />
      <div className="w-screen h-screen bg-[#9D9995] p-[25px] text-[#ECECEC] flex items-center justify-center">
        <div className='flex items-center gap-[10px] justify-center border rounded-[15px] border-[#231F40] p-[25px] bg-[#827385]'>
          <div className='w-[50%]'>
            <img src={ backgroundLogin } className='object-cover border rounded-[15px]'/>
          </div>
          <div className='flex flex-col w-[50%]'>
            <h1 className="text-center text-[30px] font-[600]">Đăng nhập</h1>
            <form onSubmit={(event) => handleSubmit(event)} className="p-[25px] flex flex-col gap-[15px]">
              <div className='flex flex-col gap-[5px]'>
                <label htmlFor='email' className="text-[15px] font-[500]">Email:</label>
                <input type="email" className="border rounded-[10px] border-[#231F40] p-[15px]" name="email"/>
              </div>
              <div className='flex flex-col gap-[5px]'>
                <label htmlFor='password' className="text-[15px] font-[500]">Mật khẩu:</label>
                <input type="password" className="border rounded-[10px] border-[#231F40] p-[15px]" name="password"/>
              </div>
              <div className='flex items-center justify-center'>
                <button className="cursor-pointer p-[5px] border rounded-[10px] border-[#00171F] bg-[#525FE1] text-[#F5F5F5] w-[40%]">
                    Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login