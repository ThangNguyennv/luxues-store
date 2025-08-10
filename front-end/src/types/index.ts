export interface UpdatedBy {
  account_id: string,
  updatedAt: Date
}

export interface ProductGeneralInfoInterface {
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
  description: string,
  slug: string,
}

export interface ProductInfoInterface extends ProductGeneralInfoInterface {
  price: number,
  discountPercentage: number,
  stock: number,
  accountFullName: string,
  featured: string,
  product_category_id: string
}

export interface ProductCategoryInfoInterface extends ProductGeneralInfoInterface {
  children: ProductCategoryInfoInterface[] | []
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

export interface ProductHelperInterface {
  accounts: AccountInfoInterface[],
  filterStatus: FilterStatusInterface[],
  pagination: PaginationInterface,
}

export interface ProductCurrentParamsInterface {
  keyword: string,
  currentSortkey: string,
  currentSortValue: string
}

export interface ProductParamsInterface {
  keyword: string,
  sortKey: string,
  sortValue: string
  loading: boolean
}

export interface ProductAllResponseInterface extends ProductHelperInterface, ProductCurrentParamsInterface {
  products: ProductInfoInterface[],
}

export interface ProductCategoryAllResponseInterface extends ProductHelperInterface, ProductCurrentParamsInterface {
  productCategories: ProductCategoryInfoInterface[],
}

export interface ProductStates extends ProductHelperInterface, ProductParamsInterface {
  products: ProductInfoInterface[],
}

export type ProductActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductStates> }
  | { type: 'RESET' }

export interface ProductCategoryStates extends ProductHelperInterface, ProductParamsInterface {
  productCategories: ProductCategoryInfoInterface[],
}

export type ProductCategoryActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductCategoryStates> }
  | { type: 'RESET' }


export type AlertStates = {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

export type AlertActions =
  | { type: 'SHOW_ALERT', payload: { message: string; severity: 'success' | 'error' } }
  | { type: 'HIDE_ALERT' }

export interface LoginInterface {
  code: number,
  email: string,
  password: string,
  token: string
}

export interface LogoutInterface {
  error: Error,
  code: number,
}

interface StatisticGroup {
  total: number,
  active: number,
  inactive: number,
}
type StatisticKey = 'categoryProduct' | 'product' | 'account' | 'user';
type Statistic = Record<StatisticKey, StatisticGroup>;

export interface DashboardInterface {
  statistic: Statistic
}

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
  token: string
}

export interface MyAccountDetailInterface {
  myAccount: AccountInfoInterface,
  role: RoleInfoInterface
}

export interface ProductDetailInterface {
  product: ProductInfoInterface
}

