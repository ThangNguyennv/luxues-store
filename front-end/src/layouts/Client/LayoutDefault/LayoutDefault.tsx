import { Outlet } from 'react-router-dom'
import Header from '~/components/client/Header/Header'
import Footer from '~/components/client/Footer/Footer'

const LayoutDefault = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default LayoutDefault