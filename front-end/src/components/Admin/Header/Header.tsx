import { Link } from 'react-router-dom'
import { useHeader } from '~/hooks/admin/header/useHeader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { IoIosNotificationsOutline } from 'react-icons/io'
import Skeleton from '@mui/material/Skeleton'

const Header = () => {
  const {
    myAccount,
    handleLogout,
    handleOpen,
    handleClose,
    anchorEl,
    setAnchorEl
  } = useHeader()

  return (
    <>
      {myAccount ? (
        <>
          <header className="
            bg-[#00171F] p-[20px]
            text-[25px] font-[700] text-[#EFF2F2]
            flex items-center justify-between
            fixed top-0 left-0 right-0
            w-full z-50 shadow-md
            "
          >
            <Link to="/admin/dashboard">ADMIN</Link>
            <div className='flex items-center justify-between gap-[25px]'>
              <IoIosNotificationsOutline />
              <Link
                to={'/admin/my-account'}
                onMouseEnter={(event) => handleOpen(event)}
                onMouseLeave={handleClose}
                className='flex items-center justify-center gap-[10px]'
              >
                <div className='flex items-center justify-center gap-[8px] cursor-pointer'>
                  <img
                    src={myAccount.avatar}
                    className='border rounded-[50%] w-[40px] h-[40px] object-cover'
                  />
                  <span>{myAccount.fullName}</span>
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
                      <Link to={'/admin/my-account'}>Thông tin tài khoản</Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/admin/settings/general'}>Cài đặt</Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <button onClick={handleLogout}>Đăng xuất</button>
                    </MenuItem>
                  </Menu>
                </div>
              </Link>
            </div>
          </header>
        </>
      ) : (
        <>
          <header className="
            bg-[#00171F] p-[20px]
            text-[25px] font-[700] text-[#EFF2F2]
            flex items-center justify-between
            fixed top-0 left-0 right-0
            w-full z-50 shadow-md
            "
          >
            <Skeleton variant="text" width={81} height={38} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex items-center justify-between gap-[25px]'>
              <Skeleton variant="circular" width={25} height={25} sx={{ bgcolor: 'grey.400' }}/>
              <div
                className='flex items-center justify-center gap-[10px]'
              >
                <div className='flex items-center justify-center gap-[8px] cursor-pointer'>
                  <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={113} height={38} sx={{ bgcolor: 'grey.400' }}/>
                </div>
              </div>
            </div>
          </header>
        </>
      )}
    </>
  )
}

export default Header