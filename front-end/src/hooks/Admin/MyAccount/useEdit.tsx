import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { fetchMyAccountAPI, fetchUpdateMyAccountAPI } from '~/apis/admin/myAccount.api'
import type { AccountInfoInterface, AccountInterface } from '~/types'

export const useEditMyAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [password, setPassword] = useState<string>('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')

  useEffect(() => {
    fetchMyAccountAPI().then((res: AccountInterface) => {
      setAccountInfo(res.account)
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

    const response = await fetchUpdateMyAccountAPI(formData)
    if (response.code === 200) {
      setAlertMessage('Đã cập nhật thành công tài khoản!')
      setAlertSeverity('success')
      setAlertOpen(true)
      setTimeout(() => {
        window.location.href = '/admin/my-account' // Fix load lại trang sau!
      }, 2000)
    } else if (response.code === 409) {
      setAlertMessage(`Email ${response.account.email} đã tồn tại, vui lòng chọn email khác!`)
      setAlertSeverity('error')
      setAlertOpen(true)
    }
  }

  return {
    accountInfo,
    setAccountInfo,
    password,
    setPassword,
    alertOpen,
    setAlertOpen,
    alertMessage,
    alertSeverity,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  }
}