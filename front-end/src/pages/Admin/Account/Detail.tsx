import { useState } from 'react'
import type { AccountInfoInterface, RoleInfoInterface } from '~/types/account.type'

const DetailAccount = () => {
    const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
    const [role, setRole] = useState<RoleInfoInterface | null>(null)
  return (
    <>

    </>
  )
}

export default DetailAccount