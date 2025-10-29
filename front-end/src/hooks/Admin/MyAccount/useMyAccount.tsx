import { useEffect, useState } from 'react'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import type { AccountInfoInterface, MyAccountDetailInterface } from '~/types/account.type'
import type { RolesInfoInterface } from '~/types/role.type'

export const useMyAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [role, setRole] = useState<RolesInfoInterface | null>(null)

  useEffect(() => {
    fetchMyAccountAPI().then((data: MyAccountDetailInterface) => {
      setAccountInfo(data.myAccount)
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