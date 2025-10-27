/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useSearchParams } from 'react-router-dom'
import { fetchResetPasswordAPI } from '~/apis/client/auth.api'

const useReset = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const { dispatchAlert } = useAlertContext()

  // Lấy token từ URL ngay khi component được tải
  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setToken(urlToken)
    } else {
      // Nếu không có token, báo lỗi và điều hướng
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đường dẫn không hợp lệ hoặc đã hết hạn.', severity: 'error' }
      })
      navigate('/user/login')
    }
  }, [searchParams, navigate, dispatchAlert])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setIsLoading(true)
    try {
      // Kiểm tra lại token trước khi gửi
      if (!token) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Token không hợp lệ.', severity: 'error' }})
        setIsLoading(false)
        return
      }
      const form = event.currentTarget
      const password = form.password.value
      const confirmPassword = form.confirmPassword.value

      const response = await fetchResetPasswordAPI(password, confirmPassword, token)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/user/login')
        }, 1500)
      } else if (response.code === 401) {
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
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading
  }
}

export default useReset