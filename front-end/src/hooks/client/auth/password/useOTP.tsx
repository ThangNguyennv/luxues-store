/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchForgotPasswordAPI, fetchOTPPasswordAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useOTP = () => {
  const navigate = useNavigate()
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? '' // luôn là string

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const form = event.currentTarget
      const email = form.email.value
      const otp = form.otp.value
      const response = await fetchOTPPasswordAPI(email, otp)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/user/password/reset')
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

  const handleClick = async () => {
    if (isSending) return
    setIsSending(true)
    const response = await fetchForgotPasswordAPI(email)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
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
    setIsSending(false)
  }

  return {
    handleSubmit,
    email,
    handleClick,
    isSending,
    isLoading
  }
}

export default useOTP