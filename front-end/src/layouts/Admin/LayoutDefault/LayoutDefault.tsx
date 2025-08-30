import { Outlet } from 'react-router-dom'
import Header from '~/components/admin/Header/Header'
import Sidebar from '~/components/admin/Sidebar/Sidebar'

const LayoutDefaultAdmin = () => {
  return (
    <>
      <Header />
      <div className='flex bg-[#EFEFF6] bg-cover min-h-screen'>
        <Sidebar />
        <div className='flex justify-center flex-1 ml-[200px] my-[75px]'>
          <div className='container flex flex-col'>
            <Outlet />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default LayoutDefaultAdmin