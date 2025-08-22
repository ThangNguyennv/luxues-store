import { IoIosNotifications, IoMdClose } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import { IoMdCart } from 'react-icons/io'
import { FaRegUserCircle } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa'
import logo from '~/assets/images/Header/logo.png'
import Menu from '@mui/material/Menu'
import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { Link, useNavigate } from 'react-router-dom'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/client/AuthContext'
import { fetchLogoutAPI } from '~/apis/client/auth.api'

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { accountUser, setAccountUser } = useAuth()
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)
  const handleLogout = async () => {
    const response = await fetchLogoutAPI()
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setAccountUser(null)
      setTimeout(() => {
        navigate('/user/login')
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  return (
    <>
      {/* Top header */}
      <div className="bg-primary sm:py-[10px] py-[9px]">
        <div className="container mx-auto px-[16px]">
          <div className="flex">
            <div className="text-white flex-1 text-center sm:text-[14px] text-[12px]">
              <span className="font-[400]">Đăng ký để được giảm giá 20%.</span>
              <a className="font-[500] underline ml-[5px]" href="#">Đăng Ký Ngay</a>
            </div>
            <button className="text-white text-[14px] sm:inline-block hidden"><IoMdClose /></button>
          </div>
        </div>
      </div>
      {/* End Top header */}
      {/* Header */}
      <header className="sm:py-[24px] py-[20px] sticky top-0 bg-[#96D5FE] backdrop-blur-[45px] z-999">
        <div className="container mx-auto px-[16px]">
          <div className="flex items-center md:gap-x-[40px] gap-x-[16px]">
            <button className=" text-[20px] md:hidden inline">
              <FaBars />
            </button>
            <Link
              className="flex items-center justify-between gap-[4px] font-[700] sm:text-[32px] text-[25px] text-primary lg:flex-none flex-1"
              to={'/'}
            >
              <img
                src={logo}
                className='w-[50px] h-[50px] bg-amber-900'
              />
              LUXUES STORE
            </Link>
            <nav className="md:block hidden">
              <ul className="menu flex gap-x-[24px] font-[400] text-[16px] text-black">
                <li><a href="/">Trang chủ</a></li>
                <li><a href="">Trang phục</a></li>
                <li><a href="">Phụ kiện</a></li>
                <li><a href="">Thương hiệu</a></li>
                <li><a href="">Bài Viết</a></li>
              </ul>
            </nav>
            <form
              className="
                flex-1 lg:flex
                hidden items-center
                gap-x-[12px] px-[16px] py-[12px]
                bg-[#F0F0F0] rounded-[62px] text-[16px]"
              action="#"
            >
              <button className="text-[#00000066]">
                <IoSearch />
              </button>
              <input className="bg-transparent flex-1" type="" placeholder="Tìm kiếm sản phẩm..."/>
            </form>
            <div className="flex items-center gap-x-[14px] text-[21px]">
              <a className="lg:hidden inline" href="#">
                <IoSearch />
              </a>
              <a href='#'>
                <IoIosNotifications />
              </a>
              <a href="#">
                <IoMdCart />
              </a>
              <div
                onMouseEnter={(event) => handleOpen(event)}
                onMouseLeave={handleClose}
                className='flex items-center justify-center gap-[5px]'
              >
                <FaRegUserCircle />
                <span>{accountUser ? accountUser.fullName : 'Khách'}</span>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      onMouseEnter: () => setAnchorEl(anchorEl), // giữ menu khi hover
                      onMouseLeave: handleClose // rời ra thì đóng
                    }
                  }}
                >
                  <MenuItem sx={{
                    '&:hover': {
                      backgroundColor: '#E0F2FE',
                      color: '#00A7E6'
                    }
                  }}>
                    <Link to={'/user/info'}>Thông tin tài khoản</Link>
                  </MenuItem>
                  <MenuItem sx={{
                    '&:hover': {
                      backgroundColor: '#E0F2FE',
                      color: '#00A7E6'
                    }
                  }}>
                    Cài đặt
                  </MenuItem>
                  <MenuItem sx={{
                    '&:hover': {
                      backgroundColor: '#E0F2FE',
                      color: '#00A7E6'
                    }
                  }}>
                    <div onClick={handleLogout}>Đăng xuất</div>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* End Header */}
    </>
  )
}

export default Header