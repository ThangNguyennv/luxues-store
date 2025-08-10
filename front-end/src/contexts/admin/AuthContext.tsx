/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { MyAccountDetailInterface } from '~/types'

interface AuthContextType {
    myAccount: MyAccountDetailInterface['myAccount'] | null
    setMyAccount: (account: MyAccountDetailInterface['myAccount'] | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [myAccount, setMyAccount] = useState<AuthContextType['myAccount']>(null)
  return (
    <AuthContext.Provider value={{ myAccount, setMyAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}