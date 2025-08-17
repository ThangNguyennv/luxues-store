import { Editor } from '@tinymce/tinymce-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { RolesInfoInterface } from '~/types/role.type'
import { API_KEY } from '~/utils/constants'

const CreateRole = () => {
  const initialRole: RolesInfoInterface = {
    title: '',
    description: '',
    permissions: [],
    updatedBy: []
  }
  const [roleInfo, setRoleInfo] = useState<RolesInfoInterface>(initialRole)
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const response = await fetchCreateRoleAPI(roleInfo)
    if (response.code === 201) {
      setRoleInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/roles')
      }, 2000)
    }
  }
  return (
    <>
      <h1 className="text-[40px] font-[600] text-[#192335]">Thêm mới nhóm quyền</h1>
      <form
        onSubmit={(event) => handleSubmit(event)}
        className='flex flex-col gap-[10px]'
      >
        <div className="form-group">
          <label htmlFor="title">Tiêu đề</label>
          <input
            onChange={(event) => setRoleInfo({ ...roleInfo, title: event.target.value })}
            type="text"
            id="title"
            name="title"
            required
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
            onEditorChange={(newValue) => setRoleInfo({ ...roleInfo, description: newValue })}
            id="desc"
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer w-[10%] border rounded-[5px] bg-[#525FE1] text-white p-[7px]"
        >
          Tạo mới
        </button>
      </form>
    </>
  )
}

export default CreateRole