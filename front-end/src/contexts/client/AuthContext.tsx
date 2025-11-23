/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { UserDetailInterface } from '~/types/user.type'

interface AuthContextType {
  accountUser: UserDetailInterface['accountUser'] | null
  setAccountUser: (user: UserDetailInterface['accountUser'] | null) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthClientProvider = ({ children }: { children: ReactNode }) => {
  const [accountUser, setAccountUser] = useState<AuthContextType['accountUser']>(null)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    handleGoogleCallback()
  }, [])

  // XỬ LÝ TOKEN TỪ GOOGLE CALLBACK
  const handleGoogleCallback = async () => {
    const token = searchParams.get('tokenUser')
    const cartId = searchParams.get('cartId')

    if (token) {

      try {
        await axios.post(
          `${import.meta.env.VITE_API_ROOT}/user/set-auth-cookies`,
          { token, cartId },
          { withCredentials: true }
        )

        searchParams.delete('tokenUser')
        searchParams.delete('cartId')
        setSearchParams(searchParams, { replace: true })

        // Fetch thông tin user
        await fetchUserInfo()

        navigate('/', { replace: true })

      } catch (error) {
        console.error(' Lỗi set cookies:', error)
        setLoading(false)
      }
    } else {
      // Không có token từ callback, loading sẽ được handle bởi component khác
      setLoading(false)
    }
  }

  // Hàm fetch user info (tách ra để dùng chung)
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ROOT}/user/account/info`,
        { withCredentials: true }
      )
      setAccountUser(response.data.accountUser)
    } catch (error) {
      console.log(' Chưa đăng nhập hoặc token hết hạn', error)
      setAccountUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ accountUser, setAccountUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}