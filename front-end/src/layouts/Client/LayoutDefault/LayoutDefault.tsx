import { Outlet } from 'react-router-dom'
import Header from '~/components/client/Header/Header'
import Footer from '~/components/client/Footer/Footer'
import Contact from '~/pages/client/Chat/ContactShop'

const LayoutDefault = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Contact />
    </>
  )
}

export default LayoutDefault