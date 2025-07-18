const Sidebar = () => {
  return (
    <div className="sider w-[10%] bg-[#192335] p-[20px] text-[15px] font-[600] text-[#EFF2F2] h-screen">
      <div className="inner-menu">
        <ul className="flex flex-col gap-[10px]">
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Tổng quan</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Danh mục sản phẩm</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Danh sách Sản phẩm</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Danh sách đơn hàng</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Danh mục bài viết</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Danh sách bài viết</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Thùng rác</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Nhóm quyền</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Phân quyền</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Tài khoản</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Người dùng</a>
          </li>
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Cài đặt chung</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar