import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLoginAPI } from '~/apis/admin/auth.api'

export const useLoginAdmin = () => {
  const navigate = useNavigate()
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.email.value
    const password = form.password.value
    const res = await fetchLoginAPI(email, password)
    if (res.code === 200) {
      setAlertMessage('Đăng nhập thành công!')
      setAlertSeverity('success')
      setAlertOpen(true)

      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1500)
    } else if (res.code === 401) {
      setAlertMessage('Tài khoản hoặc mật khẩu không chính xác')
      setAlertSeverity('error')
      setAlertOpen(true)
    } else if (res.code == 403) {
      setAlertMessage('Tài khoản đã bị khóa!')
      setAlertSeverity('error')
      setAlertOpen(true)
    } else if (res.code === 400) {
      setAlertMessage('Vui lòng đăng nhập lại tài khoản mật khẩu!')
      setAlertSeverity('error')
      setAlertOpen(true)
    }
  }
  return {
    alertOpen,
    setAlertOpen,
    alertMessage,
    setAlertMessage,
    alertSeverity,
    setAlertSeverity,
    handleSubmit
  }
}