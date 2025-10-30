import { Outlet } from 'react-router-dom'
import Header from '~/components/Admin/Header/Header'
import Sidebar from '~/components/Admin/Sidebar/Sidebar'

const LayoutDefaultAdmin = () => {
  return (
    <>
      <Header />
      <div className='flex bg-[#D9D9D9] bg-cover min-h-screen'>
        <Sidebar />
        <div className='flex justify-center flex-1 ml-[130px] my-[75px]'>
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