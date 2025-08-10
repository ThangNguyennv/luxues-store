import { type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLoginAPI } from '~/apis/admin/auth.api'
import { useAlertContext } from '~/contexts/admin/AlertContext'

export const useLoginAdmin = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.email.value
    const password = form.password.value
    const res = await fetchLoginAPI(email, password)
    if (res.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đăng nhập thành công!', severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1500)
    } else if (res.code === 401) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Tài khoản hoặc mật khẩu không chính xác!', severity: 'error' }
      })
    } else if (res.code == 403) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Tài khoản đã bị khóa!', severity: 'error' }
      })
    } else if (res.code === 400) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng đăng nhập lại tài khoản mật khẩu!', severity: 'error' }
      })
    }
  }
  return {
    handleSubmit
  }
}