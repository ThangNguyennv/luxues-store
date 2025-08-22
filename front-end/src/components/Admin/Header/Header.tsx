import { Link } from 'react-router-dom'
import { FaRegUserCircle } from 'react-icons/fa'
import { useHeader } from '~/hooks/admin/header/useHeader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

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
      <header className="bg-[#00171F] p-[20px] text-[25px] font-[700] text-[#EFF2F2] flex items-center justify-between fixed top-0 left-0 right-0 w-full z-50 shadow-md">
        <a href="/admin/dashboard">ADMIN</a>
        <div
          onMouseEnter={(event) => handleOpen(event)}
          onMouseLeave={handleClose}
          className='flex items-center justify-center gap-[5px]'
        >
          <FaRegUserCircle />
          <span>{myAccount ? myAccount.fullName : 'Khách'}</span>
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
              <div onClick={handleLogout}>Đăng xuất</div>
            </MenuItem>
          </Menu>
        </div>
      </header>
    </>
  )
}

export default Header