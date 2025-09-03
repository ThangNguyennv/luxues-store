import Skeleton from '@mui/material/Skeleton'
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
      {accountInfo ? (
        <>
          <div className='text-[17px] mt-[15px] flex flex-col gap-[15px] w-full bg-[#FFFFFF] py-[15px] pl-[50px] shadow-md'>
            <div className='text-[24px] font-[700] mt-[10px]'>Chi tiết tài khoản</div>
            <img
              src={accountInfo.avatar}
              className='border rounded-[50%] w-[200px] h-[200px]'
            />
            <div>
              <b>Họ và tên: </b>
              {accountInfo.fullName}
            </div>
            {roles && (
              roles.map((role, index) => (
                role._id === accountInfo.role_id ? <div key={index}><b>Vai trò: </b> {role.title}</div> : ''
              ))
            )}
            <div>
              <b>Email: </b>
              {accountInfo.email}
            </div>
            <div>
              <b>Số điện thoại: </b>
              {accountInfo.phone}
            </div>
            <div>
              <b>Trạng thái: </b>
              {accountInfo.status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
            </div>
            <Link
              to={`/admin/accounts/edit/${accountInfo._id}`}
              className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[6%] text-center text-[14px]'
            >
                Chỉnh sửa
            </Link>
          </div>
        </>
      ) : (
        <div className='text-[17px] mt-[15px] flex flex-col gap-[15px] w-full bg-[#FFFFFF] py-[15px] pl-[50px] shadow-md'>
          <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="circular" width={200} height={200} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={90} height={33} sx={{ bgcolor: 'grey.400' }}/>
        </div>
      )}
    </>
  )
}

export default DetailAccount