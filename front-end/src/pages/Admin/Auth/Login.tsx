import backgroundLogin from '~/assets/images/Home/image-login.png'
import { useLoginAdmin } from '~/hooks/admin/auth/useLogin'
import { IoEye, IoEyeOff } from 'react-icons/io5'

const Login = () => {
  const {
    handleSubmit,
    showPassword,
    setShowPassword
  } = useLoginAdmin()

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
                <input
                  type="email"
                  className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  name="email"
                  required
                />
              </div>
              <div className='flex flex-col gap-[5px]'>
                <label htmlFor='password' className="text-[15px] font-[500]">Mật khẩu:</label>
                {/* Ô nhập mật khẩu có icon con mắt */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
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