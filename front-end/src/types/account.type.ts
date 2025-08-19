import type { RolesInfoInterface } from './role.type'

export interface RoleInfoInterface {
  title: string,
}

export interface AccountInfoInterface {
  _id: string,
  avatar: string,
  fullName: string,
  email: string,
  phone: string,
  status: string,
  token: string,
  role_id: string
}

export interface MyAccountDetailInterface {
  myAccount: AccountInfoInterface,
  role: RoleInfoInterface
}

export interface AccountDetailInterface {
  accounts: AccountInfoInterface[],
  roles: RolesInfoInterface[]
}