import { Link } from 'react-router-dom'
import { useMyAccount } from '~/hooks/admin/myAccount/useMyAccount'

const MyAccountAdmin = () => {
  const {
    accountInfo,
    role
  } = useMyAccount()

  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#BC3433] m-[20px]">Thông tin tài khoản</h1>
      {accountInfo && (
        <div className="text-[30px] border rounded-[5px] p-[20px] m-[20px] flex flex-col gap-[10px]">
          <p>
            <img
              src={accountInfo.avatar}
              alt="Avatar"
              className="border rounded-[50%] w-[150px] h-[150px]"
            />
          </p>
          <p><b>Họ và tên:</b> {accountInfo.fullName}</p>
          <p><b>Email:</b> {accountInfo.email}</p>
          <p><b>Số điện thoại:</b> {accountInfo.phone}</p>
          {role && (
            <div><b>Vai trò:</b> {role.title}</div>
          )}
          <p>
            <b>Trạng thái: </b>
            {
              accountInfo.status === 'active' ?
                <span className="text-green-500">Hoạt động</span> :
                <span className="text-red-500"> Dừng hoạt động</span>
            }
          </p>
          <Link
            to={'/admin/my-account/edit'}
            className='text-[20px] border rounded-[5px] bg-[#FFAB19] hover:bg-[#2F57EF] p-[5px] text-white w-[10%] text-center'
          >
            Chỉnh sửa
          </Link>
        </div>
      )}
    </>
  )
}

export default MyAccountAdmin