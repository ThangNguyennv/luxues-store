import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LayoutDefault from './layouts/LayoutDefault/LayoutDefault'
import Home from './pages/Home/Home'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

function App() {
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
            <Route path={'/'} element={<Home />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
