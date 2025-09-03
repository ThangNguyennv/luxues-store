import Skeleton from '@mui/material/Skeleton'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDetailRoleAPI } from '~/apis/admin/role.api'
import type { RolesDetailInterface, RolesInfoInterface } from '~/types/role.type'

const DetailRole = () => {
  const [roleDetail, setRoleDetail] = useState<RolesInfoInterface | null>(null)
  const params = useParams()
  const id = params.id
  useEffect(() => {
    if (!id) return
    fetchDetailRoleAPI(id).then((response: RolesDetailInterface) => {
      setRoleDetail(response.role)
    })
  }, [id])

  return (
    <>
      {roleDetail ? (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[18px]'>
          <div>
            <b>Nhóm quyền: </b>
            <span className='text-[16px]'>
              {roleDetail.title}
            </span>
          </div>
          <div>
            <b>Mô tả ngắn: </b>
            <div className='text-[16px]' dangerouslySetInnerHTML={{ __html: roleDetail.description }} />
          </div>
          <Link
            to={`/admin/roles/edit/${id}`}
            className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[6%] text-[14px] text-center'
          >
            Chỉnh sửa
          </Link>
        </div>
      ) : (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[18px]'>
          <Skeleton variant="text" width={140} height={48} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="text" width={120} height={48} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="text" width={130} height={48} sx={{ bgcolor: 'grey.400' }}/>
          <Skeleton variant="rectangular" width={78} height={34} sx={{ bgcolor: 'grey.400' }}/>
        </div>
      )}
    </>
  )
}

export default DetailRole