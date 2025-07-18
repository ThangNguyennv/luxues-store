const Header = () => {
  return (
    <>
      <header className="bg-[#00171F] p-[20px] text-[25px] font-[700] text-[#EFF2F2] flex items-center justify-between">
        <a href="/admin/dashboard">ADMIN</a>
        <div className="flex items-center justify-center gap-[15px]">
          <a href="#" className="cursor-pointer border rounded-[5px] p-[5px] text-[20px] font-[500] bg-[#2F57EF]">USER</a>
          <a href="#" className="cursor-pointer border rounded-[5px] p-[5px] text-[20px] font-[500] bg-[#BC3433]">Đăng xuất</a>
        </div>
      </header>
    </>
  )
}

export default Header