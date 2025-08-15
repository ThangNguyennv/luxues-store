import { useNavigate } from 'react-router-dom'
import { fetchLogoutAPI } from '~/apis/admin/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/admin/AuthContext'

export const useHeader = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const { myAccount, setMyAccount } = useAuth()

  const handleLogout = async (): Promise<void> => {
    const response = await fetchLogoutAPI()
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setMyAccount(null)
      setTimeout(() => {
        navigate('/admin/auth/login')
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  return {
    myAccount,
    handleLogout
  }
}