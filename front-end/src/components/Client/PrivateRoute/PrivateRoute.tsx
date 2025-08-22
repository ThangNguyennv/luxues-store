import { useEffect, useState, type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { fetchInfoUserAPI } from '~/apis/client/user.api'
import { useAuth } from '~/contexts/client/AuthContext'
import type { UserDetailInterface } from '~/types/user.type'

const PrivateRouteClient = ({ children }: { children: JSX.Element }) => {
  const { accountUser, setAccountUser } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInfoUserAPI().then((response: UserDetailInterface) => {
      setAccountUser(response.accountUser)
    })
      .catch(() => {
        setAccountUser(null) // nếu lỗi thì vẫn set null
      })
      .finally(() => {
        setLoading(false) // kết thúc loading
      })
  }, [setAccountUser])
  if (loading) return null // hoặc một loader
  if (!accountUser?.tokenUser) return <Navigate to="/user/login" replace/>

  return children
}

export default PrivateRouteClient