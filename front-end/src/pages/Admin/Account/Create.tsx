import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAccountsAPI, fetchCreateAccountAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountDetailInterface, AccountInfoInterface } from '~/types/account.type'
import type { RolesInfoInterface } from '~/types/role.type'

const CreateAccount = () => {
  const initialAccount: AccountInfoInterface = {
    _id: '',
    avatar: '',
    fullName: '',
    email: '',
    phone: '',
    status: 'active',
    password: '',
    token: '',
    role_id: ''
  }
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface>(initialAccount)
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  useEffect(() => {
    fetchAccountsAPI().then((response: AccountDetailInterface) => {
      setRoles(response.roles)
    })
  }, [])
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = uploadImageInputRef.current?.files?.[0]
    if (file) {
      formData.set('avatar', file)
    }
    const response = await fetchCreateAccountAPI(formData)
    if (response.code === 201) {
      setAccountInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/accounts')
      }, 2000)
    }
  }

  return (
    <>
      <h1 className="text-[40px] font-[600] text-[#192335]">Thêm mới tài khoản</h1>

      {accountInfo && (
        <form onSubmit={(event) => handleSubmit(event)} className="flex flex-col gap-[10px]" encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="fullName">Họ tên</label>
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, fullName: event.target.value })}
              type="text"
              id="fullName"
              name="fullName"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, email: event.target.value })}
              type="email"
              id="email"
              name="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, password: event.target.value })}
              type="password"
              id="password"
              name="password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, phone: event.target.value })}
              type="text"
              id="phone"
              name="phone"
            />
          </div>
          <div className="form-group">
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
              className="w-[150px] h-[150px]"
            />
          </div>

          <div className='form-group'>
            <label htmlFor='role_id'>Phân quyền</label>
            <select
              name='role_id'
              id='role_id'
              className='outline-none border rounded-[5px] border-[#192335]'
              value={accountInfo.role_id}
              onChange={(event) => setAccountInfo({ ...accountInfo, role_id: event.target.value })}
            >
              <option disabled> -- Chọn --</option>
              {roles && (
                roles.map((role, key) => (
                  <option key={key} value={role._id}>{role.title}</option>
                ))
              )}
            </select>
          </div>
          <div className="flex gap-[5px]">
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, status: event.target.value })}
              type="radio"
              className="border rounded-[5px] border-[#192335]"
              id="statusActive"
              name="status"
              value={'active'}
              checked={accountInfo.status === 'active' ? true : false}
            />
            <label htmlFor="statusActive">Hoạt động</label>
          </div>
          <div className="flex gap-[5px]">
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, status: event.target.value })}
              type="radio"
              className="border rounded-[5px] border-[#192335]"
              id="statusInActive"
              name="status"
              value={'inactive'}
              checked={accountInfo.status === 'inactive' ? true : false}
            />
            <label htmlFor="statusInActive">Dừng hoạt động</label>
          </div>
          <div>
            <button
              type="submit"
              className="cursor-pointer p-[5px] border rounded-[5px] border-[#00171F] bg-[#00A7E6] text-white"
            >
            Tạo mới
            </button>
          </div>
        </form>
      )}
    </>
  )
}

export default CreateAccount