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
      {roleDetail && (
        <>
          <h1 className='text-[20px] font-[700] text-[#0A033C]'>
          Nhóm quyền:
            <span className='text-[20px] font-[500] text-[#C366E7]'>
              {roleDetail.title}
            </span>
          </h1>
          <h1 className='text-[20px] font-[700] text-[#0A033C]'>
            Mô tả ngắn:
            <span className='-[700] text-[#0A033C]") Mô tả ngắn: <span class="'>
              {roleDetail.description}
            </span>
          </h1>
          <Link
            to={`/admin/roles/edit/${roleDetail._id}`} 
            className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
          >
            Chỉnh sửa
          </Link>
        </>
      )}
    </>
  )
}

export default DetailRole