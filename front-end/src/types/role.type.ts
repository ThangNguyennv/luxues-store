import type { AccountInfoInterface } from './account.type'
import type { UpdatedBy } from './helper.type'

export interface RolesInfoInterface {
  _id: string,
  title: string,
  description: string,
  permissions?: string[],
  updatedBy?: UpdatedBy[],
  createdAt: Date | null
  updatedAt: Date | null
}

export interface PermissionsInterface {
  _id: string,
  permissions: string[]
}
export interface RolesResponseInterface {
  roles: RolesInfoInterface[],
  accounts: AccountInfoInterface[]
}
export interface RolesDetailInterface {
  role: RolesInfoInterface
}