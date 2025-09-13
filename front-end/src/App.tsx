import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LayoutDefault from './layouts/client/layoutDefault/LayoutDefault'
import LayoutDefaultAdmin from './layouts/admin/layoutDefault/LayoutDefault'
import Home from './pages/client/Home'
import AOS from 'aos'
import 'aos'
import { useEffect } from 'react'
import Dashboard from './pages/admin/Dashboard/Dashboard'
import Account from './pages/admin/Account'
import ArticleAdmin from './pages/admin/Article'
import ArticleCategoryAdmin from './pages/admin/ArticleCategory'
import MyAccountAdmin from './pages/admin/MyAccount'
import ProductAdmin from './pages/admin/Product'
import ProductCategoryAdmin from './pages/admin/ProductCategory'
import Role from './pages/admin/Role'
import General from './pages/admin/Setting/General/General'
import Advance from './pages/admin/Setting/Advance/Advance'
import Trash from './pages/admin/Trash/Trash'
import User from './pages/admin/User'
import Login from './pages/admin/Auth/Login'
import Permission from './pages/admin/Role/Permission'
import EditMyAccount from './pages/admin/MyAccount/Edit'
import DetailProduct from './pages/admin/Product/Detail'
import EditProduct from './pages/admin/Product/Edit'
import CreateProduct from './pages/admin/Product/Create'
import CreateProductCategory from './pages/admin/ProductCategory/Create'
import DetailProductCategory from './pages/admin/ProductCategory/Detail'
import EditProductCategory from './pages/admin/ProductCategory/Edit'
import CreateArticle from './pages/admin/Article/Create'
import DetailArticle from './pages/admin/Article/Detail'
import EditArticle from './pages/admin/Article/Edit'
import DetailArticleCategory from './pages/admin/ArticleCategory/Detail'
import EditArticleCategory from './pages/admin/ArticleCategory/Edit'
import CreateArticleCategory from './pages/admin/ArticleCategory/Create'
import DetailRole from './pages/admin/Role/Detail'
import EditRole from './pages/admin/Role/Edit'
import CreateRole from './pages/admin/Role/Create'
import CreateAccount from './pages/admin/Account/Create'
import DetailAccount from './pages/admin/Account/Detail'
import EditAccount from './pages/admin/Account/Edit'
import DetailUser from './pages/admin/User/Detail'
import EditUser from './pages/admin/User/Edit'
import EditSettingGeneral from './pages/admin/Setting/General/Edit'
import LayoutAuth from './layouts/client/layoutAuth/LayoutAuth'
import LoginClient from './pages/client/Auth/Login/Login'
import RegisterClient from './pages/client/Auth/Register/Register'
import Forgot from './pages/client/Auth/Password/Forgot/Forgot'
import OTP from './pages/client/Auth/Password/OTP/OTP'
import Reset from './pages/client/Auth/Password/Reset/Reset'
import PrivateRouteAdmin from './components/admin/PrivateRoute/PrivateRoute '
import PrivateRouteClient from './components/client/PrivateRoute/PrivateRoute'
import MyAccountClient from './pages/client/MyAccount'
import EditMyAccountClient from './pages/client/MyAccount/Edit'
import ChangePassword from './pages/client/MyAccount/ChangePassword'
import LayoutUser from './layouts/client/layoutUser/LayoutUser'
import ForgotPassword from './pages/admin/Auth/ForgotPassword'
import ProductClient from './pages/client/Product'
import Detail from './pages/client/Product/Detail'
import Cart from './pages/client/Cart'
import Checkout from './pages/client/Checkout'
import Success from './pages/client/Checkout/Success'
import OrderAdmin from './pages/admin/Order'
import DetailOrder from './pages/admin/Order/Detail'

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
          <Route path='/' element={<LayoutDefault />}>
            <Route index element={<Home />}/>
            <Route path='products'>
              <Route index element={<ProductClient />}/>
              <Route path='detail/:slug' element={<Detail />}/>
            </Route>
            <Route path='cart' element={<Cart />}/>
            <Route path='checkout' element={<Checkout />}/>
            <Route path='checkout/success/:orderId' element={<Success />}/>
            <Route path='user' element={<PrivateRouteClient><LayoutUser /></PrivateRouteClient>}>
              <Route path='notification'></Route>
              <Route path='account'>
                <Route path='info'>
                  <Route index element={ <MyAccountClient />} />
                  <Route path='edit' element={ <EditMyAccountClient />}/>
                  <Route path='change-password' element={ <ChangePassword />}/>
                </Route>
                <Route path='payment'></Route>
                <Route path='address'></Route>
                <Route path='setting-privacy'></Route>
              </Route>
              <Route path='purchase'></Route>
              <Route path='voucher-wallet'></Route>
              <Route path='coin'></Route>
            </Route>
          </Route>
          <Route path='user' element={<LayoutAuth />}>
            <Route path='login' element={<LoginClient />} />
            <Route path='register' element={<RegisterClient />} />
            <Route path='password'>
              <Route path='forgot' element={ <Forgot />}/>
              <Route path='otp' element={ <OTP />}/>
              <Route path='reset' element={ <Reset />}/>
            </Route>
          </Route>
          <Route path='admin' element={<PrivateRouteAdmin><LayoutDefaultAdmin /></PrivateRouteAdmin>}>
            <Route index element={ <Dashboard />} />
            <Route path='dashboard' element={ <Dashboard />}/>
            <Route path='orders'>
              <Route index element={ <OrderAdmin />}/>
              <Route path='detail/:id' element={<DetailOrder />}/>
              <Route path='edit/:id'/>
            </Route>
            <Route path='products'>
              <Route index element={ <ProductAdmin />}/>
              <Route path='create' element={<CreateProduct />}/>
              <Route path='detail/:id' element={ <DetailProduct />}/>
              <Route path='edit/:id' element={<EditProduct />}/>
            </Route>
            <Route path='products-category'>
              <Route index element={<ProductCategoryAdmin />}/>
              <Route path='create' element={<CreateProductCategory />}/>
              <Route path='detail/:id' element={ <DetailProductCategory />}/>
              <Route path='edit/:id' element={<EditProductCategory />}/>
            </Route>
            <Route path='articles'>
              <Route index element={ <ArticleAdmin />}/>
              <Route path='create' element={ <CreateArticle />}/>
              <Route path='detail/:id' element={ <DetailArticle />}/>
              <Route path='edit/:id' element={ <EditArticle />}/>
            </Route>
            <Route path='articles-category'>
              <Route index element={ <ArticleCategoryAdmin />}/>
              <Route path='create' element={ <CreateArticleCategory />}/>
              <Route path='detail/:id' element={ <DetailArticleCategory />}/>
              <Route path='edit/:id' element={ <EditArticleCategory />}/>
            </Route>
            <Route path='roles'>
              <Route index element={ <Role />} />
              <Route path='create' element={ <CreateRole />} />
              <Route path='detail/:id' element={ <DetailRole />} />
              <Route path='edit/:id' element={ <EditRole />} />
              <Route path='permissions' element={<Permission />} />
            </Route>
            <Route path='accounts'>
              <Route index element={ <Account />}/>
              <Route path='create' element={ <CreateAccount />}/>
              <Route path='detail/:id' element={ <DetailAccount />}/>
              <Route path='edit/:id' element={ <EditAccount />}/>
            </Route>
            <Route path='users'>
              <Route index element={<User />}/>
              <Route path='detail/:id' element={<DetailUser />}/>
              <Route path='edit/:id' element={<EditUser />}/>
            </Route>
            <Route path='my-account'>
              <Route index element={ <MyAccountAdmin />}/>
              <Route path='edit' element={ <EditMyAccount />}/>
            </Route>
            <Route path='settings'>
              <Route path='general'>
                <Route index element={<General />}/>
                <Route path='edit' element={<EditSettingGeneral />}/>
              </Route>
              <Route path='advance' element={<Advance />}/>
            </Route>
            <Route path='trash' element={<Trash />}/>
          </Route>
          <Route path='admin/auth'>
            <Route path='login' element={ <Login />}/>
            <Route path='forgot-password' element={<ForgotPassword />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
