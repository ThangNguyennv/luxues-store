import { useEffect, useState, type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { MyAccountDetailInterface } from '~/types/account.type'

const PrivateRouteAdmin = ({ children }: { children: JSX.Element }) => {
  const { myAccount, setRole, setMyAccount } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyAccountAPI().then((response: MyAccountDetailInterface) => {
      setMyAccount(response.myAccount)
      setRole(response.role)
    })
      .catch(() => {
        setMyAccount(null) // nếu lỗi thì vẫn set null
      })
      .finally(() => {
        setLoading(false) // kết thúc loading
      })
  }, [setMyAccount, setRole])
  if (loading) return null // hoặc một loader
  if (!myAccount?.token) return <Navigate to="/admin/auth/login" replace/>

  return children
}

export default PrivateRouteAdmin