import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailUserAPI, fetchEditUserAPI } from '~/apis/admin/user.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { UserDetailInterface, UserInfoInterface } from '~/types/user.type'

const EditUser = () => {
  const [userInfo, setUserInfo] = useState<UserInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    fetchDetailUserAPI(id).then((response: UserDetailInterface) => {
      setUserInfo(response.user)
    })
  }, [id])
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!userInfo) return
    const formData = new FormData(event.currentTarget)
    formData.set('fullName', userInfo.fullName)
    formData.set('email', userInfo.email)
    formData.set('phone', userInfo.phone)
    formData.set('password', userInfo.password)

    const response = await fetchEditUserAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/users/detail/${id}`)
      }, 2000)
    }
  }
  return (
    <>
      <h1 className="text-[40px] font-[600] text-[#192335]">Chỉnh sửa tài khoản người dùng</h1>

      {userInfo && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex flex-col gap-[10px]"
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="avatar">Avatar</label>
            <input
              onChange={(event) => handleChange(event)}
              ref={uploadImageInputRef}
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
            />
            <img
              ref={uploadImagePreviewRef}
              src={userInfo.avatar}
              className="w-[150px] h-auto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              onChange={(event) => setUserInfo({ ...userInfo, fullName: event.target.value })}
              type="text"
              id="fullName"
              name="fullName"
              value={userInfo.fullName}/>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(event) => setUserInfo({ ...userInfo, email: event.target.value })}
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              onChange={(event) => setUserInfo({ ...userInfo, phone: event.target.value })}
              type="phone"
              id="phone"
              name="phone"
              value={userInfo.phone}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              onChange={(event) => setUserInfo({ ...userInfo, password: event.target.value })}
              type="text"
              id="password"
              name="password"
            />
          </div>

          <div className="flex gap-[5px]">
            <input
              onChange={(event) => setUserInfo({ ...userInfo, status: event.target.value })}
              type="radio"
              className="border rounded-[5px] border-[#192335]"
              id="statusActive"
              name="status"
              value={'active'}
              checked={userInfo.status === 'active' ? true : false}
            />
            <label htmlFor="statusActive">Hoạt động</label>
          </div>

          <div className="flex gap-[5px]">
            <input
              onChange={(event) => setUserInfo({ ...userInfo, status: event.target.value })}
              type="radio"
              className="border rounded-[5px] border-[#192335]"
              id="statusInActive"
              name="status"
              value={'inactive'}
              checked={userInfo.status === 'inactive' ? true : false}
            />
            <label htmlFor="statusInActive">Dừng hoạt động</label>
          </div>

          <button
            type="submit"
            className="cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[7px]"
          >
            Cập nhật
          </button>
        </form>
      )}
    </>
  )
}

export default EditUser