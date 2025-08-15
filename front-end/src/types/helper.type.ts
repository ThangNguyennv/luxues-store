import type { AccountInfoInterface } from './account.type'

export interface UpdatedBy {
  account_id: string,
  updatedAt: Date
}

export interface FilterStatusInterface {
  name: string,
  status: string,
  class?: string
}

export interface PaginationInterface {
  currentPage: number,
  limitItems: number,
  skip: number,
  totalPage: number
}

export interface HelperInterface {
  accounts: AccountInfoInterface[],
  filterStatus: FilterStatusInterface[],
  pagination: PaginationInterface,
}

export interface CurrentParamsInterface {
  keyword: string,
  currentSortkey: string,
  currentSortValue: string
}

export interface ParamsInterface {
  keyword: string,
  sortKey: string,
  sortValue: string
  loading: boolean
}

export interface GeneralInfoInterface {
  createdBy: {
    account_id: string,
    createdAt: Date
  },
  updatedBy: UpdatedBy[],
  _id: string,
  title: string,
  thumbnail: string,
  position: number,
  status: string,
  slug: string,
}