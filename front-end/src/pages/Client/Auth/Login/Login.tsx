import { Link } from 'react-router-dom'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import useLoginClient from '~/hooks/client/auth/login/useLogin'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { FcGoogle } from 'react-icons/fc'

const LoginClient = () => {
  const {
    handleSubmit,
    showPassword,
    setShowPassword,
    isLoading
  } = useLoginClient()

  // 2. Lấy API_ROOT từ biến môi trường của Vite
  const API_ROOT = import.meta.env.VITE_API_ROOT
  const googleAuthUrl = `${API_ROOT}/user/auth/google`

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[70px] p-8 md:p-[70px] mt-[40px] mb-[80px] bg-[#96D5FE]">
        <div className='flex flex-col gap-[10px] text-center text-[20px] mb-8 md:mb-0'>
          <div className='font-[600]'>LUXUES STORE</div>
          <div>Shop thời trang được yêu thích nhất tại Việt Nam</div>
        </div>

        <div className="w-full max-w-md md:w-[40%] lg:w-[30%] border rounded-[5px] p-[20px] bg-amber-50">
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[15px] text-center"
          >
            <div className='text-[20px] font-[500]'>Đăng nhập</div>
            <input
              type='email'
              name='email'
              placeholder="Email"
              className="border rounded-[5px] p-[10px] focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {/* Ô nhập mật khẩu có icon con mắt */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu"
                className="border rounded-[5px] p-[10px] w-full pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
              // Thêm w-full để nút bấm rộng bằng input
              className='w-full bg-[#192335] border rouned-[5px] p-[10px] text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <Link
              to={'/user/password/forgot'}
              className='hover:underline text-[14px] text-[#003459] flex items-center justify-start'
            >
              Quên mật khẩu?
            </Link>
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">HOẶC</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <a
              href={googleAuthUrl}
              className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 rounded-[5px] p-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <FcGoogle size={20} />
              <span>Đăng nhập bằng Google</span>
            </a>
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