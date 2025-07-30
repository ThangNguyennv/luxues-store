import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LayoutDefault from './layouts/Client/LayoutDefault/LayoutDefault'
import LayoutDefaultAdmin from './layouts/Admin/LayoutDefault/LayoutDefault'
import Home from './pages/Client/Home/Home'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import Product from './pages/Client/Product/Product'
import Dashboard from './pages/Admin/Dashboard/Dashboard'
import Account from './pages/Admin/Account/Account'
import AuthAdmin from './pages/Admin/Auth/Auth'
import ArticleAdmin from './pages/Admin/Article/Article'
import ArticleCategoryAdmin from './pages/Admin/ArticleCategory/ArticleCategory'
import MyAccountAdmin from './pages/Admin/MyAccount/MyAccount'
import OrderAdmin from './pages/Admin/Order/Order'
import ProductAdmin from './pages/Admin/Product/Product'
import ProductCategoryAdmin from './pages/Admin/ProductCategory/ProductCategory'
import Role from './pages/Admin/Role/Role'
import LayoutSetting from './layouts/Admin/LayoutSetting/LayoutSetting'
import General from './pages/Admin/Setting/General'
import Advance from './pages/Admin/Setting/Advance'
import Trash from './pages/Admin/Trash/Trash'
import User from './pages/Admin/User/User'
import Login from './pages/Admin/Auth/Login'
import Permission from './pages/Admin/Role/Permission'
import EditMyAccount from './pages/Admin/MyAccount/Edit'
import PrivateRoute from './components/Admin/PrivateRoute/PrivateRoute '
import DetailProduct from './pages/Admin/Product/Detail'
import EditProduct from './pages/Admin/Product/Edit'
import CreateProduct from './pages/Admin/Product/Create'

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
            <Route path='/' element={<Home />}/>
            <Route path='/products' element={<Product />}/>
          </Route>
          <Route path='/admin/*' element={<PrivateRoute><LayoutDefaultAdmin /></PrivateRoute>}>
            <Route index element={ <Dashboard />} />
            <Route path='accounts' element={ <Account />}/>
            <Route path='articles' element={ <ArticleAdmin />}/>
            <Route path='articles-category' element={ <ArticleCategoryAdmin />}/>
            <Route path='dashboard' element={ <Dashboard />}/>
            <Route path='my-account' element={ <MyAccountAdmin />}/>
            <Route path='my-account/edit' element={ <EditMyAccount />}/>
            <Route path='orders' element={ <OrderAdmin />}/>
            <Route path='products' element={ <ProductAdmin />}/>
            <Route path='products/detail/:id' element={ <DetailProduct />}/>
            <Route path='products/edit/:id' element={<EditProduct />}/>
            <Route path='products/create' element={<CreateProduct />}/>
            <Route path='products-category' element={<ProductCategoryAdmin />}/>
            <Route path='roles' element={ <Role />} />
            <Route path='roles/permissions' element={<Permission />} />
            <Route path='settings' element={<LayoutSetting />}>
              <Route path='general' element={<General />}/>
              <Route path='advance' element={<Advance />}/>
            </Route>
            <Route path='trash' element={<Trash />}/>
            <Route path='users' element={<User />}/>
          </Route>
          <Route path='/admin/auth' element={<AuthAdmin />}>
            <Route path='login' element={ <Login />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
