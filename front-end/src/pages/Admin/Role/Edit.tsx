import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailRoleAPI, fetchEditRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { RolesDetailInterface, RolesInfoInterface } from '~/types/role.type'
import { API_KEY } from '~/utils/constants'
import Skeleton from '@mui/material/Skeleton'

const EditRole = () => {
  const [roleInfo, setRoleInfo] = useState<RolesInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    fetchDetailRoleAPI(id).then((response: RolesDetailInterface) => {
      setRoleInfo(response.role)
    })
  }, [id])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!roleInfo) return
    const payload: RolesInfoInterface = {
      _id: roleInfo._id,
      title: roleInfo.title,
      description: roleInfo.description,
      createdAt: roleInfo.createdAt,
      updatedAt: roleInfo.updatedAt
    }
    const response = await fetchEditRoleAPI(id, payload)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/roles/detail/${id}`)
      }, 2000)
    }
  }

  return (
    <>
      {roleInfo ? (
        <form onSubmit={(event) => handleSubmit(event)} className='flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md'>
          <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa nhóm quyền</h1>
          <div className='form-group'>
            <label htmlFor='title'>Tiêu đề</label>
            <input
              onChange={(event) => setRoleInfo(roleInfo ? { ...roleInfo, title: event.target.value } : roleInfo)}
              type='text'
              id='title'
              name='title'
              className='py-[3px] text-[16px]'
              value={roleInfo.title}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desc">Mô tả</label>
            <Editor
              apiKey={API_KEY}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
              }}
              value={roleInfo.description}
              onEditorChange={(newValue) => setRoleInfo(roleInfo ? { ...roleInfo, description: newValue }: roleInfo)}
              id="desc"
            />
          </div>

          <button
            type="submit"
            className="w-[6%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
          >
              Cập nhật
          </button>
        </form>
      ) : (
        <div className='flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md'>
          <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa nhóm quyền</h1>
          <div className='form-group'>
            <Skeleton variant="text" width={60} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={1000} height={32} sx={{ bgcolor: 'grey.400' }}/>
          </div>

          <div className="form-group">
            <Skeleton variant="text" width={60} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={1000} height={500} sx={{ bgcolor: 'grey.400' }}/>
          </div>
          <Skeleton variant="rectangular" width={100} height={50} sx={{ bgcolor: 'grey.400' }}/>
        </div>
      )}
    </>
  )
}

export default EditRole