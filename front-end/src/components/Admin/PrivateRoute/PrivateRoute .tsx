import { useEffect, useState, type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { fetchMyAccountAPI } from '~/apis'
import type { AccountInterface } from '../Types/Interface'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchMyAccountAPI().then((data: AccountInterface) => {
      setToken(data.account.token)
    })
      .catch(() => {
        setToken(null) // nếu lỗi thì vẫn set null
      })
      .finally(() => {
        setLoading(false) // kết thúc loading
      })
  }, [])
  if (loading) return null // hoặc một loader
  if (!token) return <Navigate to="/admin/auth/login" replace />

  return children
}

export default PrivateRoute