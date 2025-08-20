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
            <NavLink to={'/admin/orders'}>Danh sách đơn hàng</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/products-category'}>Danh mục trang phục</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/products'}>Danh sách trang phục</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/accessories-category'}>Danh mục phụ kiện</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/accessories'}>Danh sách phụ kiện</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/brands-category'}>Danh mục thương hiệu</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/brands'}>Danh sách thương hiệu</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/articles-category'}>Danh mục bài viết</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/articles'}>Danh sách bài viết</NavLink>
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
            <NavLink to={'/admin/users'}>Tài khoản người dùng</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/settings/general'}>Cài đặt chung</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/settings/advance'}>Cài đặt nâng cao</NavLink>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/trash'}>Thùng rác</NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar