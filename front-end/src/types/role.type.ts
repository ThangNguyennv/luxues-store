import type { UpdatedBy } from './helper.type'

export interface RolesInfoInterface {
  _id: string,
  title: string,
  description: string,
  permissions: [],
  updatedBy: UpdatedBy[],
}

export interface RolesResponseInterface {
  roles: RolesInfoInterface[]
}
export interface RolesDetailInterface {
  role: RolesInfoInterface
}