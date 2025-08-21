import { Outlet } from 'react-router-dom'
import Footer from '~/components/client/Footer/Footer'

const LayoutAuth = () => {
  return (
    <>
      <header className='pt-[50px] pb-[50px] flex items-center justify-center'>
        <div className='container flex items-center justify-between gap-[15px]'>
          <div className='text-[] font-[500]'>
            LUXUES STORE / CỦA HÀNG THỜI TRANG ĐẸP - RẺ - CHẤT
          </div>
          <div className='text-[] font-[600] hover:underline cursor-pointer'>
            Bạn cần giúp đỡ?
          </div>
        </div>
      </header>
      <Outlet />
      <Footer />
    </>
  )
}

export default LayoutAuth