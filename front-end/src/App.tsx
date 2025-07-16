import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LayoutDefault from './layouts/LayoutDefault/LayoutDefault'
import Home from './pages/Home/Home'

function App() {
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
