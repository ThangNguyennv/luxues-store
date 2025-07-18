import { Outlet } from 'react-router-dom'
import Header from '~/components/Admin/Header/Header'
import Footer from '~/components/Admin/Footer/Footer'
import Sidebar from '~/components/Admin/Sidebar/Sidebar'

const LayoutDefaultAdmin = () => {
  return (
    <>
      <Header />
      <div className='flex'>
        <Sidebar />
        <div className='flex justify-center w-[90%]'>
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