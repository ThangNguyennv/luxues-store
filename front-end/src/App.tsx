import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LayoutDefault from './layouts/client/LayoutDefault/LayoutDefault'
import LayoutDefaultAdmin from './layouts/admin/layoutDefault/LayoutDefault'
import Home from './pages/client/Home'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import Product from './pages/client/Product/Product'
import Dashboard from './pages/admin/Dashboard/Dashboard'
import Account from './pages/admin/Account'
import AuthAdmin from './pages/admin/Auth'
import ArticleAdmin from './pages/admin/Article'
import ArticleCategoryAdmin from './pages/admin/ArticleCategory'
import MyAccountAdmin from './pages/admin/MyAccount'
import OrderAdmin from './pages/admin/Order/Order'
import ProductAdmin from './pages/admin/Product'
import ProductCategoryAdmin from './pages/admin/ProductCategory'
import Role from './pages/admin/Role'
import LayoutSetting from './layouts/admin/layoutSetting/LayoutSetting'
import General from './pages/admin/Setting/General/General'
import Advance from './pages/admin/Setting/Advance/Advance'
import Trash from './pages/admin/Trash/Trash'
import User from './pages/admin/User'
import Login from './pages/admin/Auth/Login'
import Permission from './pages/admin/Role/Permission'
import EditMyAccount from './pages/admin/MyAccount/Edit'
import PrivateRoute from './components/admin/PrivateRoute/PrivateRoute '
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
            <Route path='accounts/create' element={ <CreateAccount />}/>
            <Route path='accounts/detail/:id' element={ <DetailAccount />}/>
            <Route path='accounts/edit/:id' element={ <EditAccount />}/>
            <Route path='articles' element={ <ArticleAdmin />}/>
            <Route path='articles/detail/:id' element={ <DetailArticle />}/>
            <Route path='articles/edit/:id' element={ <EditArticle />}/>
            <Route path='articles/create' element={ <CreateArticle />}/>
            <Route path='articles-category' element={ <ArticleCategoryAdmin />}/>
            <Route path='articles-category/detail/:id' element={ <DetailArticleCategory />}/>
            <Route path='articles-category/edit/:id' element={ <EditArticleCategory />}/>
            <Route path='articles-category/create' element={ <CreateArticleCategory />}/>
            <Route path='dashboard' element={ <Dashboard />}/>
            <Route path='my-account' element={ <MyAccountAdmin />}/>
            <Route path='my-account/edit' element={ <EditMyAccount />}/>
            <Route path='orders' element={ <OrderAdmin />}/>
            <Route path='products' element={ <ProductAdmin />}/>
            <Route path='products/detail/:id' element={ <DetailProduct />}/>
            <Route path='products/edit/:id' element={<EditProduct />}/>
            <Route path='products/create' element={<CreateProduct />}/>
            <Route path='products-category' element={<ProductCategoryAdmin />}/>
            <Route path='products-category/detail/:id' element={ <DetailProductCategory />}/>
            <Route path='products-category/edit/:id' element={<EditProductCategory />}/>
            <Route path='products-category/create' element={<CreateProductCategory />}/>
            <Route path='roles' element={ <Role />} />
            <Route path='roles/detail/:id' element={ <DetailRole />} />
            <Route path='roles/edit/:id' element={ <EditRole />} />
            <Route path='roles/create' element={ <CreateRole />} />
            <Route path='roles/permissions' element={<Permission />} />
            <Route path='settings' element={<LayoutSetting />}>
              <Route path='general' element={<General />}/>
              <Route path='general/edit' element={<EditSettingGeneral />}/>
              <Route path='advance' element={<Advance />}/>
            </Route>
            <Route path='trash' element={<Trash />}/>
            <Route path='users' element={<User />}/>
            <Route path='users/detail/:id' element={<DetailUser />}/>
            <Route path='users/edit/:id' element={<EditUser />}/>
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
