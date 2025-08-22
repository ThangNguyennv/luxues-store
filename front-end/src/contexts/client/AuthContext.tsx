/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserDetailInterface } from '~/types/user.type'

interface AuthContextType {
    accountUser: UserDetailInterface['accountUser'] | null
    setAccountUser: (user: UserDetailInterface['accountUser'] | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthClientProvider = ({ children }: { children: ReactNode }) => {
  const [accountUser, setAccountUser] = useState<AuthContextType['accountUser']>(null)
  return (
    <AuthContext.Provider value={{ accountUser, setAccountUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}