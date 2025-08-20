import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDetailUserAPI } from '~/apis/admin/user.api'
import type { UserInfoInterface, UserDetailInterface } from '~/types/user.type'

const DetailUser = () => {
  const [user, setUser] = useState<UserInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    fetchDetailUserAPI(id).then((response: UserDetailInterface) => {
      setUser(response.user)
    })
  }, [id])

  return (
    <>
      {user && (
        <>
          <img src={user.avatar} alt='avatar' className='w-[300px]'/>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Họ và tên: {user.fullName}</h1>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Email: {user.email}</h1>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Số điện thoại: {user.phone}</h1>
          <div className='text-[35px] font-[600] text-[#00171F]'>
            {user.status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
          </div>
          <Link
            to={`/admin/users/edit/${user._id}`}
            className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
          >
            Chỉnh sửa
          </Link>
        </>
      )}
    </>
  )
}

export default DetailUser