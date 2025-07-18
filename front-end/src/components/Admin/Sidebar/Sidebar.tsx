const Sidebar = () => {
  return (
    <div className="sider w-[10%] bg-[#192335] p-[20px] text-[15px] font-[600] text-[#EFF2F2] h-screen">
      <div className="inner-menu">
        <ul className="flex flex-col gap-[10px]">
          <li className="border-b border-[#9D9995] pb-[7px]">
            <a className="text-[#F9F9FF] font-[500]">Tổng quan</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar