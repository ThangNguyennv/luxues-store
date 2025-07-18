import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LayoutDefault from './layouts/Client/LayoutDefault/LayoutDefault'
import LayoutDefaultAdmin from './layouts/Admin/LayoutDefault/LayoutDefault'
import Home from './pages/Client/Home/Home'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import Products from './pages/Client/Product/Products'
import HomeAdmin from './pages/Admin/Home/Home'

function App() {
  // const isAdminRoute = useLocation().pathname.startsWith('/admin');
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    })
    AOS.refresh() // đảm bảo refresh lại khi nội dung động
  }, [])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutDefault />}>
            <Route path='/' element={<Home />}/>
            <Route path='products' element={<Products />}/>
          </Route>
          <Route element={<LayoutDefaultAdmin />}>
            <Route path='/admin/*' element={ <HomeAdmin />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
