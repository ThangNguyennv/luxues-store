import { Outlet } from 'react-router-dom'
import Header from '~/components/Client/Header/Header'
import Footer from '~/components/Client/Footer/Footer'
import ChatPage from '~/pages/Client/ChatPage/ChatPage'

const LayoutDefault = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ChatPage />
    </>
  )
}

export default LayoutDefault