import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { fetchMyAccountAPI, fetchUpdateMyAccountAPI } from '~/apis/admin/myAccount.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountInfoInterface, MyAccountDetailInterface } from '~/types/account.type'

export const useEditMyAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [password, setPassword] = useState<string>('')
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    fetchMyAccountAPI().then((res: MyAccountDetailInterface) => {
      setAccountInfo(res.myAccount)
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
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        window.location.href = '/admin/my-account' // Fix load lại trang sau!
      }, 2000)
    } else if (response.code === 409) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    accountInfo,
    setAccountInfo,
    password,
    setPassword,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit,
    handleClick
  }
}