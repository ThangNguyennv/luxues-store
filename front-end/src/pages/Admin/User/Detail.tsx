import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDetailUserAPI } from '~/apis/admin/user.api'
import type { UserInfoInterface, UserDetailInterface } from '~/types/user.type'
import Skeleton from '@mui/material/Skeleton'
import { useAuth } from '~/contexts/admin/AuthContext'

const DetailUser = () => {
  const [user, setUser] = useState<UserInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { role } = useAuth()

  useEffect(() => {
    fetchDetailUserAPI(id).then((response: UserDetailInterface) => {
      setUser(response.accountUser)
    })
  }, [id])

  return (
    <>
      {role && role.permissions.includes('users_view') && (
        user ? (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[17px]'>
            <div className='text-[24px] font-[600] text-[#00171F]'>Thông tin chi tiết người dùng</div>
            <div className='flex flex-col gap-[15px]'>
              <img
                src={user.avatar}
                alt='avatar'
                className='cover w-[200px] h-[200px] border rounded-[50%]'
              />
              <div>
                <b>Họ và tên: </b>
                {user.fullName}
              </div>
              <div>
                <b>Email: </b>
                {user.email}
              </div>
              <div>
                <b>Số điện thoại: </b>
                {user.phone}
              </div>
              <div>
                <b>Địa chỉ: </b>
                {user.address}
              </div>
              <div>
                <b>Trạng thái: </b>
                {
                  user.status === 'active' ?
                    <span className="text-green-500 font-[600]">Hoạt động</span> :
                    <span className="text-red-500 font-[600]"> Dừng hoạt động</span>
                }
              </div>
              <Link
                to={`/admin/users/edit/${user._id}`}
                className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[6%] text-center text-[14px]'
              >
              Chỉnh sửa
              </Link>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[17px]'>
            <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex flex-col gap-[15px]'>
              <Skeleton variant="circular" width={200} height={200} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={170} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={170} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={90} height={33} sx={{ bgcolor: 'grey.400' }}/>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default DetailUser