export interface ProductDetailInterface {
  createdBy: {
    account_id: string,
    createdAt: Date
  },
  updatedBy: {
    length: number,
    account_id: string,
    updatedAt: Date
  }[],
  _id: string,
  title: string,
  price: number,
  discountPercentage: number,
  thumbnail: string,
  stock: number,
  position: number,
  accountFullName: string,
  status: string,
  description: string,
  featured: string,
  productCategoryId: string
}

export interface ProductCategoryDetailInterface {
  createdBy: {
    account_id: string,
    createdAt: Date
  },
  updatedBy: {
    length: number,
    account_id: string,
    updatedAt: Date
  }[],
  _id: string,
  title: string,
  thumbnail: string,
  position: number,
  status: string,
  description: string,
  slug: string
  children: ProductCategoryDetailInterface[] | []
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

export interface ProductAllResponseInterface {
  products: ProductDetailInterface[],
  filterStatus: FilterStatusInterface[],
  pagination: PaginationInterface,
  account: AccountInfoInterface[],
  currentKeyword: string,
  currentSortKey: string,
  currentSortValue: string
}

export interface ProductCategoryAllResponseInterface {
  records: ProductCategoryDetailInterface[],
  filterStatus: FilterStatusInterface[],
  pagination: PaginationInterface,
  account: AccountInfoInterface[],
  currentKeyword: string,
  currentSortKey: string,
  currentSortValue: string
}

export interface LoginResponseInterface {
  code: number,
  email: string,
  password: string,
  token: string
}

export interface LogoutResponseInterface {
  error: Error,
  code: number,
}

interface StatisticGroup {
  total: number,
  active: number,
  inactive: number,
}

interface Statistic {
  categoryProduct: StatisticGroup,
  product: StatisticGroup,
  account: StatisticGroup,
  user: StatisticGroup,
}

export interface DashboardInterface {
  statistic: Statistic
}

export interface RoleInterface {
  title: string,
}

export interface AccountInfoInterface {
  _id: string,
  avatar: string,
  fullName: string,
  email: string,
  phone: string,
  status: string,
  token: string
}

export interface AccountInterface {
  account: AccountInfoInterface,
  role: RoleInterface
}

export interface ProductInterface {
  product: ProductDetailInterface
}

export interface ProductCategoryState {
  products: ProductCategoryDetailInterface[],
  accounts: AccountInfoInterface[],
  filterStatus: FilterStatusInterface[],
  pagination: PaginationInterface | null,
  keyword: string,
  sortKey: string,
  sortValue: string,
  loading: boolean
}

export type ProductCategoryAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductCategoryState> }
  | { type: 'RESET' }

export type AlertState = {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

export type AlertAction =
  | { type: 'SHOW_ALERT', payload: { message: string; severity: 'success' | 'error' } }
  | { type: 'HIDE_ALERT' }