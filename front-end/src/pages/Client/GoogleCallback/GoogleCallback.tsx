/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
// src/pages/GoogleCallback.tsx
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '~/contexts/client/AuthContext'
import { CircularProgress, Box } from '@mui/material'

const GoogleCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAccountUser } = useAuth()

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    const tokenUser = searchParams.get('tokenUser')
    const cartId = searchParams.get('cartId')

    if (!tokenUser) {
      // Không có tokenUser, redirect về login
      navigate('/user/login', { replace: true })
      return
    }

    try {
      // Set cookies
      await axios.post(
        `${import.meta.env.VITE_API_ROOT}/user/set-auth-cookies`,
        { tokenUser, cartId },
        { withCredentials: true }
      )

      // Fetch user info
      const response = await axios.get(
        `${import.meta.env.VITE_API_ROOT}/user/account/info`,
        { withCredentials: true }
      )
      setAccountUser(response.data.accountUser)

      // Redirect về trang chủ
      navigate('/', { replace: true })

    } catch (error) {
      console.error('Lỗi Google callback:', error)
      navigate('/user/login?error=callback_failed', { replace: true })
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
      <p style={{ marginLeft: '16px' }}>Đang xử lý đăng nhập...</p>
    </Box>
  )
}

export default GoogleCallback