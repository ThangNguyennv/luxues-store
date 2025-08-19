import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDetailAccountAPI } from '~/apis/admin/account.api'
import type { AccountDetailInterface, AccountInfoInterface } from '~/types/account.type'
import type { RolesInfoInterface } from '~/types/role.type'

const DetailAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    fetchDetailAccountAPI(id).then((response: AccountDetailInterface) => {
      setAccountInfo(response.account)
      setRoles(response.roles)
    })
  }, [id])

  return (
    <>
      {accountInfo && (
        <>
          <img src={accountInfo.avatar} className='w-[300px]'/>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>
            Họ và tên: {accountInfo.fullName}
          </h1>
          {roles && (
            roles.map((role, index) => (
              role._id === accountInfo.role_id ? <div key={index}>Vai trò: {role.title}</div> : ''
            ))
          )}
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Email: {accountInfo.email}</h1>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Số điện thoại: {accountInfo.phone}</h1>
          <div className='text-[35px] font-[600] text-[#00171F]'>
            <span>Trạng thái:</span>
            {accountInfo.status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
          </div>
          <Link to={`/admin/accounts/edit/${accountInfo._id}`} className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'>Chỉnh sửa</Link>
        </>
      )}
    </>
  )
}

export default DetailAccount