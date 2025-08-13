import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sider w-[200px] bg-[#192335] p-[20px] text-[15px] font-[600] text-[#EFF2F2] h-screen fixed top-[80px] left-0 z-40">
      <div className="inner-menu">
        <ul className="flex flex-col gap-[10px] text-[#F9F9FF] font-[500]">
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/dashboard'}>Tổng quan</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/products-category'}>Danh mục sản phẩm</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/products'}>Danh sách Sản phẩm</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/orders'}>Danh sách đơn hàng</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/articles-category'}>Danh mục bài viết</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/articles'}>Danh sách bài viết</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/trash'}>Thùng rác</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/roles'}>Nhóm quyền</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/roles/permissions'}>Phân quyền</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/accounts'}>Tài khoản Admin</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/users'}>Người dùng</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/general'}>Cài đặt chung</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/dvance'}>Cài đặt nâng cao</NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar