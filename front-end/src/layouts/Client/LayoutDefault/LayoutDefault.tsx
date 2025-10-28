import { Outlet } from 'react-router-dom'
import Header from '~/components/client/Header/Header'
import Footer from '~/components/client/Footer/Footer'
import ChatPage from '~/pages/client/ChatPage/ChatPage'

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