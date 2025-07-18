import { Outlet } from 'react-router-dom'
import Header from '~/components/Admin/Header/Header'
import Footer from '~/components/Admin/Footer/Footer'
import Sidebar from '~/components/Admin/Sidebar/Sidebar'

const LayoutDefaultAdmin = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
      <Footer />
    </>
  )
}

export default LayoutDefaultAdmin