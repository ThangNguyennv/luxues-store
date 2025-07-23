import { useEffect, useState } from 'react'
import { fetchMyAccountAPI } from '~/apis'

interface Role {
  title: string;
}

interface AccountInfo {
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  status: string;
};

const MyAccountAdmin = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  useEffect(() => {
    fetchMyAccountAPI().then((data) => {
      setAccountInfo(data.account)
      setRole(data.role)
    })
  }, [])
  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#BC3433] m-[20px]">Thông tin tài khoản</h1>
      {accountInfo && (
        <div className="border rounded-[5px] p-[10px] m-[20px]">
          <p>
            <b>Avatar:</b>
            <img src={accountInfo.avatar} alt="Avatar" className="" />
          </p>
          <p className='text-[35px] font-[600] text-[#00171F]'><b>Tên:</b> {accountInfo.fullName}</p>
          <p className='text-[35px] font-[600] text-[#00171F]'><b>Email:</b> {accountInfo.email}</p>
          <p className='text-[35px] font-[600] text-[#00171F]'><b>Số điện thoại:</b> {accountInfo.phone}</p>
          {role && (
            <p className='text-[35px] font-[600] text-[#00171F]'><b>Vai trò:</b> {role.title}</p>
          )}
          <p className='text-[35px] font-[600] text-[#00171F]'>
            <b>Trạng thái:</b>
            {accountInfo.status === 'active' ? <span className="text-green-500"> Hoạt động</span> : <span className="text-red-500"> Dừng hoạt động</span>}
          </p>
        </div>
      )}
    </>
  )
}

export default MyAccountAdmin