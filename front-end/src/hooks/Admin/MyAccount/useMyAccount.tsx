import { useEffect, useState } from 'react'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import type { AccountInfoInterface, AccountInterface, RoleInterface } from '~/types'

export const useMyAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [role, setRole] = useState<RoleInterface | null>(null)

  useEffect(() => {
    fetchMyAccountAPI().then((data: AccountInterface) => {
      setAccountInfo(data.account)
      setRole(data.role)
    })
  }, [])

  return {
    accountInfo,
    setAccountInfo,
    role,
    setRole
  }
}