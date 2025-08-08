import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import type { AccountInfoInterface, AccountInterface } from '~/types'
import { fetchLogoutAPI } from '~/apis/admin/auth.api'

export const useHeader = () => {
  const navigate = useNavigate()
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)

  useEffect(() => {
    fetchMyAccountAPI().then((response: AccountInterface) => {
      setAccountInfo(response.account)
    })
  }, [])

  const handleLogout = async (): Promise<void> => {
    const response = await fetchLogoutAPI()
    if (response.code === 200) {
      setAlertMessage('Đăng xuất thành công!')
      setAlertSeverity('success')
      setAlertOpen(true)
      setTimeout(() => {
        navigate('/admin/auth/login')
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  return {
    alertOpen,
    setAlertOpen,
    alertMessage,
    setAlertMessage,
    alertSeverity,
    setAlertSeverity,
    accountInfo,
    setAccountInfo,
    handleLogout
  }
}