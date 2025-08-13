import { Outlet } from 'react-router-dom'
import Header from '~/components/admin/Header/Header'
import Footer from '~/components/admin/Footer/Footer'
import Sidebar from '~/components/admin/Sidebar/Sidebar'

const LayoutDefaultAdmin = () => {
  return (
    <>
      <Header />
      <div className='flex'>
        <Sidebar />
        <div className='flex justify-center flex-1 ml-[200px] mt-[82px]'>
          <div className='container flex flex-col gap-[15px] p-[15px]'>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default LayoutDefaultAdmin