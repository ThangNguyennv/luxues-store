/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLoginAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/client/AuthContext'

const useLoginClient = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()
  const { setAccountUser } = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const form = event.currentTarget
      const email = form.email.value
      const password = form.password.value
      const response = await fetchLoginAPI(email, password)

      if (response.code === 200 && response.accountUser) {
        setAccountUser(response.accountUser)
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        navigate('/')
      } else if (response.code === 401) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      } else if (response.code == 403) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      } else if (response.code === 400) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đã xảy ra lỗi, vui lòng thử lại.', severity: 'error' }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleSubmit,
    showPassword,
    setShowPassword,
    isLoading
  }
}

export default useLoginClient