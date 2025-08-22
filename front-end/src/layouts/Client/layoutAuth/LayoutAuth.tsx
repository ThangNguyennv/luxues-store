import { Link, Outlet } from 'react-router-dom'
import Footer from '~/components/client/Footer/Footer'

const LayoutAuth = () => {
  return (
    <>
      <header className='pt-[50px] pb-[50px] flex items-center justify-center'>
        <div className='container flex items-center justify-between gap-[15px]'>
          <Link
            to={'/user/login'}
            className='font-[500] hover:text-[#2F57EF]'>
            LUXUES STORE / CỦA HÀNG THỜI TRANG ĐẸP - RẺ - CHẤT
          </Link>
          <Link
            to={''}
            className='text-[] font-[600] hover:underline cursor-pointer hover:text-[#525FE1]'>
            Bạn cần giúp đỡ?
          </Link>
        </div>
      </header>
      <Outlet />
      <Footer />
    </>
  )
}

export default LayoutAuth