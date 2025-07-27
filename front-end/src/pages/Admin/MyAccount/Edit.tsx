import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { fetchMyAccountAPI, fetchUpdateMyAccountAPI } from '~/apis'
import type { AccountInfoInterface, AccountInterface } from '~/components/Admin/Types/Interface'
import { AlertToast } from '~/components/Alert/Alert'

const EditMyAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [password, setPassword] = useState<string>('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')

  useEffect(() => {
    fetchMyAccountAPI().then((data: AccountInterface) => {
      setAccountInfo(data.account)
    })
  }, [])

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
    formData.set('password', password)

    try {
      const response = await fetchUpdateMyAccountAPI(formData)
      console.log("🚀 ~ Edit.tsx ~ handleSubmit ~ response:", response);
      if (response.code === 200) {
        setAlertMessage('Đã cập nhật thành công tài khoản!')
        setAlertSeverity('success')
        setAlertOpen(true)
        setTimeout(() => {
          window.location.href = '/admin/my-account' // Fix load lại trang sau!
        }, 2000)
      } else if (response.code === 401) {
        setAlertMessage(`Email ${response.account.email} đã tồn tại, vui lòng chọn email khác!`)
        setAlertSeverity('error')
        setAlertOpen(true)
      }
    } catch (error) {
      alert('Lỗi!' + error)
    }
  }

  return (
    <>
      <AlertToast
        open={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
      />
      <h1 className="text-[40px] font-[600] text-[#192335]">Chỉnh sửa thông tin cá nhân</h1>
      {accountInfo && (
        <form onSubmit={(event) => handleSubmit(event)} className="flex flex-col gap-[5px]" encType="multipart/form-data">
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="avatar"><b>Avatar</b></label>
            <input
              onChange={(event) => handleChange(event)}
              ref={uploadImageInputRef}
              type="file"
              className="border rounded-[5px] w-[5%] bg-[#DDDDDD] p-[5px]"
              name="avatar"
              accept="image/*"
            />
            <img
              ref={uploadImagePreviewRef}
              src={accountInfo.avatar}
              alt="Avatar preview"
              className="w-[150px] h-[150px]"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fullName"><b>Họ và tên</b></label>
            <input
              onChange={(event) =>
                setAccountInfo(accountInfo ? { ...accountInfo, fullName: event.target.value } : accountInfo)
              }
              type="text"
              className=""
              id="fullName"
              name="fullName"
              value={accountInfo.fullName}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email"><b>Email</b></label>
            <input onChange={(event) =>
              setAccountInfo(accountInfo ? { ...accountInfo, email: event.target.value }
                : accountInfo)
            }
            type="email"
            className=""
            id='email'
            name="email"
            value={accountInfo.email}
            required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone"><b>Số điện thoại</b></label>
            <input onChange={(event) =>
              setAccountInfo(accountInfo ? { ...accountInfo, phone: event.target.value }
                : accountInfo)
            }
            type="phone"
            className=""
            id='phone'
            name="phone"
            value={accountInfo.phone}
            />
            <div className="form-group">
              <label htmlFor="password"><b>Mật khẩu</b></label>
              <input
                onChange={(event) => setPassword(event.target.value)}
                type="text"
                className=""
                id='password'
                name="password"
                value={password}
              />
            </div>
          </div>
          <button type="submit" className=" cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[7px]">Cập nhật</button>
        </form>
      )}
    </>
  )
}

export default EditMyAccount