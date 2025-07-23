import { type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLoginAPI } from '~/apis'
import backgroundLogin from '~/assets/images/Home/image-login.png'

const Login = () => {
  const navigate = useNavigate()
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.email.value
    const password = form.password.value
    try {
      const res = await fetchLoginAPI(email, password)
      // Nếu cần, bạn có thể lưu token vào localStorage ở đây
      if (res.code === 200) {
        alert('Đăng nhập thành công!')
        navigate('/admin/dashboard')
      } else if (res.code === 400) {
        alert('Email không tồn tại!')
      } else if (res.code === 401) {
        alert('Tài khoản hoặc mật khẩu không chính xác')
      } else if (res.code == 402) {
        alert('Tài khoản đã bị khóa!')
      }
    } catch (error) {
      alert('Lỗi!' + error)
    }
  }

  return (
    <>
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