import { useEffect, useState, type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { fetchInfoUserAPI } from '~/apis/client/user.api'
import { useAuth } from '~/contexts/client/AuthContext'
import type { UserDetailInterface } from '~/types/user.type'
import Skeleton from '@mui/material/Skeleton'

const PrivateRouteClient = ({ children }: { children: JSX.Element }) => {
  const { accountUser, setAccountUser, loading: globalLoading } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //  Nếu đang xử lý Google callback, chờ xong
    if (globalLoading) {
      setLoading(true)
      return
    }

    if (accountUser) {
      setLoading(false)
      return
    }
    fetchInfoUserAPI()
      .then((response: UserDetailInterface) => {
        setAccountUser(response.accountUser)
      })
      .catch(() => {
        setAccountUser(null) // nếu lỗi thì vẫn set null
      })
      .finally(() => {
        setLoading(false) // kết thúc loading
      })
  }, [accountUser, setAccountUser, globalLoading])
  if (loading || globalLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton variant="text" width="60%" height={50} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    )
  }
  if (!accountUser) {
    return <Navigate to="/user/login" replace/>
  }

  return children
}

export default PrivateRouteClient