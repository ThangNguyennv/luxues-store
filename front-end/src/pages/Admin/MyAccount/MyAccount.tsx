import { Link } from 'react-router-dom'
import { useMyAccount } from '~/hooks/Admin/MyAccount/useMyAccount'

const MyAccountAdmin = () => {
  const {
    accountInfo,
    role
  } = useMyAccount()

  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#BC3433] m-[20px]">Thông tin tài khoản</h1>
      {accountInfo && (
        <div className="border rounded-[5px] p-[10px] m-[20px] flex flex-col gap-[5px]">
          <p>
            <img src={accountInfo.avatar} alt="Avatar" className="w-[150px] h-[150px]" />
          </p>
          <p className='text-[35px] font-[600] text-[#00171F]'><b>Họ và tên:</b> {accountInfo.fullName}</p>
          <p className='text-[35px] font-[600] text-[#00171F]'><b>Email:</b> {accountInfo.email}</p>
          <p className='text-[35px] font-[600] text-[#00171F]'><b>Số điện thoại:</b> {accountInfo.phone}</p>
          {role && (
            <div className='text-[35px] font-[600] text-[#00171F]'><b>Vai trò:</b> {role.title}</div>
          )}
          <p className='text-[35px] font-[600] text-[#00171F]'>
            <b>Trạng thái:</b>
            {accountInfo.status === 'active' ? <span className="text-green-500"> Hoạt động</span> : <span className="text-red-500"> Dừng hoạt động</span>}
          </p>
          <Link to={'/admin/my-account/edit'} className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[15%] text-center'>
            Chỉnh sửa thông tin
          </Link>
        </div>
      )}
    </>
  )
}

export default MyAccountAdmin