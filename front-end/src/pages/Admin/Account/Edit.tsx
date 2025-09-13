import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailAccountAPI, fetchEditAccountAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountDetailInterface, AccountInfoInterface } from '~/types/account.type'
import type { RolesInfoInterface } from '~/types/role.type'
import Skeleton from '@mui/material/Skeleton'
import { useAuth } from '~/contexts/admin/AuthContext'

const EditAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  const params = useParams()
  const id = params.id as string
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()

  useEffect(() => {
    if (!id) return
    fetchDetailAccountAPI(id).then((response: AccountDetailInterface) => {
      setAccountInfo(response.account)
      setRoles(response.roles)
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
    if (!accountInfo) return
    const formData = new FormData(event.currentTarget)
    formData.set('fullName', accountInfo.fullName)
    formData.set('email', accountInfo.email)
    formData.set('phone', accountInfo.phone)
    formData.set('password', accountInfo.password)

    const response = await fetchEditAccountAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/accounts/detail/${id}`)
      }, 2000)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return (
    <>
      {role && role.permissions.includes('accounts_edit') && (
        accountInfo ? (
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]"
            encType="multipart/form-data"
          >
            <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa tài khoản admin</h1>
            <div className="flex flex-col gap-[10px]">
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
              <img
                ref={uploadImagePreviewRef}
                src={accountInfo.avatar}
                alt="Avatar preview"
                className="border rounded-[50%] w-[150px] h-[150px]"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                onChange={(event) => setAccountInfo({ ...accountInfo, fullName: event.target.value })}
                type="text"
                id="fullName"
                name="fullName"
                className='py-[3px] text-[16px]'
                value={accountInfo.fullName}
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
                value={accountInfo.email}
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
                value={accountInfo.phone}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                onChange={(event) => setAccountInfo({ ...accountInfo, password: event.target.value })}
                type="text"
                id="password"
                name="password"
                className='py-[3px] text-[16px]'
              />
            </div>

            <div className="form-group">
              <label htmlFor="role_id">Phân quyền</label>
              <select
                value={accountInfo.role_id}
                name="role_id"
                id="role_id"
                className="outline-none border rounded-[5px] border-[#192335] py-[3px]"
                onChange={(event) => setAccountInfo({ ...accountInfo, role_id: event.target.value })}
              >
                <option value={''}> -- Chọn quyền-- </option>
                {roles && (
                  roles.map((role, index) => (
                    <option
                      key={index}
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

            <button
              type="submit"
              className="border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px] w-[5%]"
            >
            Cập nhật
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md">
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <div className="flex flex-col gap-[5px]">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="circular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={75} height={31} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className='flex items-center justify-start gap-[15px]'>
              <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <Skeleton variant="rectangular" width={76} height={37} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        )
      )}
    </>
  )
}

export default EditAccount