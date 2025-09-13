/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { MyAccountDetailInterface } from '~/types/account.type'

interface AuthContextType {
  myAccount: MyAccountDetailInterface['myAccount'] | null
  role: MyAccountDetailInterface['role'] | null
  setMyAccount: (account: MyAccountDetailInterface['myAccount'] | null) => void
  setRole: (role: MyAccountDetailInterface['role'] | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthAdminProvider = ({ children }: { children: ReactNode }) => {
  const [myAccount, setMyAccount] = useState<AuthContextType['myAccount']>(null)
  const [role, setRole] = useState<AuthContextType['role']>(null)

  return (
    <AuthContext.Provider value={{ myAccount, role, setMyAccount, setRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}