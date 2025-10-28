import { useEffect, useState, type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { MyAccountDetailInterface } from '~/types/account.type'
import Skeleton from '@mui/material/Skeleton'

const PrivateRouteAdmin = ({ children }: { children: JSX.Element }) => {
  const { myAccount, setRole, setMyAccount } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (myAccount) {
      setLoading(false)
      return
    }
    fetchMyAccountAPI().then((response: MyAccountDetailInterface) => {
      setMyAccount(response.myAccount)
      setRole(response.role)
    })
      .catch(() => {
        setMyAccount(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [myAccount, setMyAccount, setRole])
  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton variant="text" width="60%" height={50} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    )
  }
  if (!myAccount) {
    return <Navigate to="/admin/auth/login" replace/>
  }
  return children
}

export default PrivateRouteAdmin