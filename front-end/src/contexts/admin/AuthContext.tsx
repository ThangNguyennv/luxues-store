/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import type { MyAccountDetailInterface } from '~/types/account.type'
import { tokenManager } from '~/utils/tokenManager'

interface AuthContextType {
  myAccount: MyAccountDetailInterface['myAccount'] | null
  role: MyAccountDetailInterface['role'] | null
  setMyAccount: (account: MyAccountDetailInterface['myAccount'] | null) => void
  setRole: (role: MyAccountDetailInterface['role'] | null) => void
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthAdminProvider = ({ children }: { children: ReactNode }) => {
  const [myAccount, setMyAccount] = useState<AuthContextType['myAccount']>(null)
  const [role, setRole] = useState<AuthContextType['role']>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getAccessToken()

      if (token) {
        try {
          const response: MyAccountDetailInterface = await fetchMyAccountAPI()
          if (response.myAccount && response.role) {
            setMyAccount(response.myAccount)
            setRole(response.role)
          }
        } catch (error) {
          console.error('Failed to fetch user:', error)
          tokenManager.clearAccessToken()
          setMyAccount(null)
          setRole(null)
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const logout = () => {
    setMyAccount(null)
    setRole(null)
    tokenManager.clearAccessToken()
  }

  const refreshUser = async () => {
    const response: MyAccountDetailInterface = await fetchMyAccountAPI()
    if (response.myAccount && response.role) {
      setMyAccount(response.myAccount)
      setRole(response.role)
    }
  }
  return (
    <AuthContext.Provider value={{ myAccount, role, setMyAccount, setRole, isLoading, isAuthenticated: !!myAccount, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}