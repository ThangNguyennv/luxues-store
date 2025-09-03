import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAccountsAPI, fetchCreateAccountAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountInfoInterface, AccountsDetailInterface } from '~/types/account.type'
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
  // const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchAccountsAPI().then((response: AccountsDetailInterface) => {
      setRoles(response.roles)
    })
  }, [])
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
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
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return (
    <>
      {accountInfo && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]"
          encType="multipart/form-data"
        >
          <h1 className="text-[24px] font-[600] text-[#192335]">Thêm mới tài khoản</h1>
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, fullName: event.target.value })}
              type="text"
              id="fullName"
              name="fullName"
              className='py-[3px] text-[16px]'
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
              className='py-[3px] text-[16px]'
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, password: event.target.value })}
              type="password"
              id="password"
              name="password"
              className='py-[3px] text-[16px]'
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              onChange={(event) => setAccountInfo({ ...accountInfo, phone: event.target.value })}
              type="tel"
              id="phone"
              name="phone"
              className='py-[3px] text-[16px]'
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
              className='hidden'
              accept="image/*"
            />
            <button
              onClick={event => handleClick(event)}
              className="bg-[#9D9995] font-[500] border rounded-[5px] w-[5%] py-[4px] text-[14px]"
            >
              Chọn ảnh
            </button>
            {preview && (
              <img
                src={preview}
                alt="Avatar preview"
                className="border rounded-[5px] w-[150px] h-[150px]"
              />
            )}
          </div>

          <div className='form-group'>
            <label htmlFor='role_id'>Phân quyền</label>
            <select
              name='role_id'
              id='role_id'
              className='outline-none border rounded-[5px] border-[#192335] text-[16px] py-[3px]'
              value={accountInfo.role_id}
              onChange={(event) => setAccountInfo({ ...accountInfo, role_id: event.target.value })}
            >
              <option disabled> -- Chọn --</option>
              {roles && (
                roles.map((role, key) => (
                  <option
                    key={key}
                    value={role._id}
                  >
                    {role.title}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className='flex items-center justify-start gap-[15px]'>
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
          </div>
          <div>
            <button
              type="submit"
              className="p-[5px] border rounded-[5px] bg-[#525FE1] text-white text-[14px] w-[5%]"
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