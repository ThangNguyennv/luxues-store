import type { AccountInfoInterface } from './account.type'
import type { UpdatedBy } from './helper.type'

export interface RolesInfoInterface {
  _id?: string,
  title: string,
  description: string,
  permissions?: string[],
  updatedBy?: UpdatedBy[],
}

export interface PermissionsInterface {
  id: string,
  permissions: string[]
}
export interface RolesResponseInterface {
  roles: RolesInfoInterface[],
  accounts: AccountInfoInterface[]
}
export interface RolesDetailInterface {
  role: RolesInfoInterface
}