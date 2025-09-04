import { IoIosNotifications, IoMdClose } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import { IoMdCart } from 'react-icons/io'
import { FaRegUserCircle } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa'
import Menu from '@mui/material/Menu'
import { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { Link, useNavigate } from 'react-router-dom'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { fetchLogoutAPI } from '~/apis/client/auth.api'
import type { UserInfoInterface } from '~/types/user.type'
import { fetchInfoUserAPI } from '~/apis/client/user.api'
import { useSettingGeneral } from '~/contexts/client/SettingGeneralContext'
import { fetchSettingGeneralAPI } from '~/apis/client/settingGeneral.api'
import { IoLogOutOutline } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { IoSettingsOutline } from 'react-icons/io5'
import { IoIosLogIn } from 'react-icons/io'
import { FaRegRegistered } from 'react-icons/fa'
import Skeleton from '@mui/material/Skeleton'

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [accountUser, setAccountUser] = useState<UserInfoInterface | null>(null)
  const { settingGeneral, setSettingGeneral } = useSettingGeneral()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [closeTopHeader, setCloseTopHeader] = useState<boolean>(() => {
    // lấy từ sessionStorage khi khởi tạo
    const saved = sessionStorage.getItem('closeTopHeader')
    return saved === 'true'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [settingRes, userRes] = await Promise.all([
          fetchSettingGeneralAPI(),
          fetchInfoUserAPI()
        ])
        setSettingGeneral(settingRes.settingGeneral)
        setAccountUser(userRes.accountUser)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error' + error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [setSettingGeneral])

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    const response = await fetchLogoutAPI()
    if (response.code === 200) {
      sessionStorage.setItem('closeTopHeader', 'false')
      setCloseTopHeader(false)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setAccountUser(null)
      setTimeout(() => {
        navigate('/')
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleCloseTopHeader = () => {
    setCloseTopHeader(true)
    sessionStorage.setItem('closeTopHeader', 'true')
  }
  return (
    <>
      {loading && (
        <div className="bg-primary sm:py-[10px] py-[9px]">
          <div className="container mx-auto px-[16px]">
            <div className="flex items-center">
              <div className="flex-1 text-center">
                {/* Skeleton cho text */}
                <Skeleton
                  variant="text"
                  width="60%"
                  height={20}
                  sx={{ bgcolor: 'rgba(255,255,255,0.3)', margin: '0 auto' }}
                  animation="wave"
                />
              </div>
              {/* Skeleton cho nút close */}
              <Skeleton
                variant="circular"
                width={20}
                height={20}
                sx={{ bgcolor: 'rgba(255,255,255,0.3)' }}
                animation="wave"
              />
            </div>
          </div>
        </div>
      )}
      {/* Top header */}
      {!loading && !accountUser && (

        <div className={`bg-primary sm:py-[10px] py-[9px] ${closeTopHeader ? 'hidden' : 'block'}`}>
          <div className="container mx-auto px-[16px]">
            <div className="flex">
              <div className="text-white flex-1 text-center sm:text-[14px] text-[12px]">
                <span className="font-[400]">Đăng ký để được giảm giá 20%.</span>
                <Link
                  className="font-[500] hover:underline ml-[5px]"
                  to="/user/register"
                >
                    Đăng Ký Ngay
                </Link>
              </div>
              <button
                onClick={handleCloseTopHeader}
                className="text-white text-[14px] sm:inline-block hidden cursor-pointer"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End Top header */}
      {/* Header */}
      <header className="sm:py-[24px] py-[20px] sticky top-0 bg-[#96D5FE] backdrop-blur-[45px] z-999">
        <div className="container mx-auto px-[16px]">
          <div className="flex items-center md:gap-x-[40px] gap-x-[16px]">
            <button className=" text-[20px] md:hidden inline">
              <FaBars />
            </button>
            <Link
              className="flex items-center justify-between gap-[4px] font-[700] sm:text-[30px] text-[25px] text-primary lg:flex-none flex-1"
              to={'/'}
            >
              {settingGeneral ? (
                <>
                  <img
                    alt="logo"
                    src={settingGeneral[0].logo}
                    className='w-[50px] h-[50px] bg-amber-900'
                  />
                  <span className='uppercase flex flex-col items-center'>
                    <p className='text-[#00171F]' style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>{settingGeneral[0].websiteName}</p>
                    <p className='text-[10px] font-bold text-[#0A033C]' style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>Lịch lãm - Sang trọng - Quý phái</p>
                  </span>
                </>
              ) : (
                <>
                  <Skeleton variant="rectangular" width={50} height={50} sx={{ bgcolor: 'grey.400' }}/>
                  <span className='uppercase flex flex-col items-center'>
                    <Skeleton variant="text" width={213} height={50} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="text" width={176} height={15} sx={{ bgcolor: 'grey.400' }}/>
                  </span>
                </>
              )}
            </Link>
            <nav className="md:block hidden">
              <ul className="menu flex gap-x-[24px] font-[400] text-[16px] text-black">
                <li>
                  <Link to="/">
                    Trang chủ
                  </Link>
                </li>
                <li><Link to="">Trang phục</Link></li>
                <li><Link to="">Phụ kiện</Link></li>
                <li><Link to="">Thương hiệu</Link></li>
                <li><Link to="">Bài Viết</Link></li>
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
            <div className="flex items-center gap-x-[27px] text-[21px]">
              <a className="lg:hidden inline" href="#">
                <IoSearch />
              </a>
              <a href='#'>
                <IoIosNotifications className='hover:text-[#00A7E6]'/>
              </a>
              <a href="#">
                <IoMdCart className='hover:text-[#00A7E6]'/>
              </a>
              {accountUser ? (
                <div
                  onMouseEnter={(event) => handleOpen(event)}
                  onMouseLeave={handleClose}
                  className='flex items-center justify-center gap-[5px]'
                >
                  <img src={accountUser.avatar} alt='Avatar' className='border rounded-[50%] w-[40px] h-[40px] cover'/>
                  <span>{accountUser.fullName}</span>
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
                      <Link to={'/user/account/info'} className='flex items-center justify-start gap-[10px]'>
                        <CgProfile />
                        <span>Tài khoản của tôi</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={''} className='flex items-center justify-start gap-[10px]'>
                        <IoSettingsOutline />
                        <span>Cài đặt</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <div onClick={handleLogout} className='flex items-center justify-start gap-[10px]'>
                        <IoLogOutOutline />
                        <span>Đăng xuất</span>
                      </div>
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <div
                  onMouseEnter={(event) => handleOpen(event)}
                  onMouseLeave={handleClose}
                  className='flex items-center justify-center gap-[5px]'
                >
                  <FaRegUserCircle />
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
                      <Link to={'/user/login'} className='flex items-center justify-start gap-[10px]'>
                        <IoIosLogIn />
                        <span>Đăng nhập</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/register'} className='flex items-center justify-start gap-[10px]'>
                        <FaRegRegistered />
                        <span>Đăng ký</span>
                      </Link>
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* End Header */}
    </>
  )
}

export default Header