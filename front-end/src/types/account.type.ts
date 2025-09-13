import type { RolesInfoInterface } from './role.type'

export interface AccountInfoInterface {
  _id: string,
  avatar: string,
  fullName: string,
  email: string,
  password: string,
  phone: string,
  status: string,
  token: string,
  role_id: string
}

export interface MyAccountDetailInterface {
  myAccount: AccountInfoInterface,
  role: RolesInfoInterface
}

export interface AccountsDetailInterface {
  accounts: AccountInfoInterface[],
  roles: RolesInfoInterface[]
}

export interface AccountDetailInterface {
  account: AccountInfoInterface,
  roles: RolesInfoInterface[]
}