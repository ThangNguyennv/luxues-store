import { Link } from 'react-router-dom'
import { FaRegUserCircle } from 'react-icons/fa'
import { useHeader } from '~/hooks/admin/header/useHeader'

const Header = () => {
  const {
    myAccount,
    handleLogout
  } = useHeader()

  return (
    <>
      <header className="bg-[#00171F] p-[20px] text-[25px] font-[700] text-[#EFF2F2] flex items-center justify-between fixed top-0 left-0 right-0 w-full z-50 shadow-md">
        <a href="/admin/dashboard">ADMIN</a>
        <div className="flex items-center justify-center gap-[15px]">
          <Link
            to={'/admin/my-account'}
            className='flex items-center justify-between gap-[5px] cursor-pointer border rounded-[5px] p-[5px] text-[20px] font-[500] bg-[#01ADEF]'
          >
            <FaRegUserCircle /> {myAccount ? myAccount.fullName : 'Khách'}
          </Link>
          <a
            onClick={() => handleLogout()}
            className="cursor-pointer border rounded-[5px] p-[5px] text-[20px] font-[500] bg-[#BC3433]"
          >
            Đăng xuất
          </a>
        </div>
      </header>
    </>
  )
}

export default Header