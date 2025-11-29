import { type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '~/contexts/admin/AuthContext'
import Skeleton from '@mui/material/Skeleton'

const PrivateRouteAdmin = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton variant="text" width="60%" height={50} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/auth/login" replace/>
  }
  return children
}

export default PrivateRouteAdmin