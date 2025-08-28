import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useMyAccount } from '~/hooks/admin/myAccount/useMyAccount'

const MyAccountAdmin = () => {
  const {
    accountInfo,
    role
  } = useMyAccount()

  return (
    <>
      {accountInfo ? (
        <>
          <h1 className="text-[30px] font-[700] text-[#BC3433] m-[20px]">Thông tin tài khoản</h1>
          <div className="text-[30px] border rounded-[5px] p-[20px] m-[20px] flex flex-col gap-[10px] w-[50%]">
            <img
              src={accountInfo.avatar}
              alt="Avatar"
              className="border rounded-[50%] w-[150px] h-[150px]"
            />
            <span><b>Họ và tên:</b> {accountInfo.fullName}</span>
            <span><b>Email:</b> {accountInfo.email}</span>
            <span><b>Số điện thoại:</b> {accountInfo.phone}</span>
            {role && (
              <span><b>Vai trò:</b> {role.title}</span>
            )}
            <span>
              <b>Trạng thái: </b>
              {
                accountInfo.status === 'active' ?
                  <span className="text-green-500 font-[600]">Hoạt động</span> :
                  <span className="text-red-500 font-[600]"> Dừng hoạt động</span>
              }
            </span>
            <Link
              to={'/admin/my-account/edit'}
              className='text-[20px] border rounded-[5px] bg-[#FFAB19] hover:bg-[#2F57EF] p-[5px] text-white w-[15%] text-center'
            >
            Chỉnh sửa
            </Link>
          </div>
        </>
      ) : (
        <>
          <Skeleton variant="text" width={300} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <div className="text-[30px] border rounded-[5px] p-[20px] m-[20px] flex flex-col gap-[10px] w-[50%]">
            <Skeleton variant="circular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        </>
      )}
    </>
  )
}

export default MyAccountAdmin