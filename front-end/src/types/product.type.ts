import type { AccountInfoInterface } from './account.type'
import type { FilterStatusInterface, PaginationInterface, UpdatedBy } from './helper.type'

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

export interface ProductStates extends ProductHelperInterface, ProductParamsInterface {
  products: ProductInfoInterface[],
}

export type ProductActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductStates> }
  | { type: 'RESET' }

export interface ProductDetailInterface {
product: ProductInfoInterface
}

