import type { AccountInfoInterface } from './account.type'
import type { CurrentParamsInterface, GeneralInfoInterface, HelperInterface, ParamsInterface } from './helper.type'

export interface ProductInfoInterface extends GeneralInfoInterface {
  price: number,
  discountPercentage: number,
  stock: number,
  accountFullName: string,
  featured: string,
  product_category_id: string,
  description: string,
  priceNew?: number
  colors: {
    name: string
    code: string,
    images: (File | string)[]
  }[]
  sizes: string[],
  stars: {
    average: number,
    count: number
  },
  comments: {
    user_id: AccountInfoInterface,
    rating: number,
    content: string,
    status: string,
    images: string[],
    createdAt: Date | null
    updatedAt: Date | null
    color: string,
    size: string
  }[]
}

export interface ProductAllResponseInterface extends HelperInterface, CurrentParamsInterface {
  products: ProductInfoInterface[],
  allProducts: ProductInfoInterface[]
}

export interface ProductStates extends HelperInterface, ParamsInterface {
  products: ProductInfoInterface[],
  allProducts: ProductInfoInterface[],
  category?: string,
  maxPrice?: string,
  color?: string,
  size?: string
}

export type ProductActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductStates> }
  | { type: 'RESET' }

export type ProductClientActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductStates> }
  | { type: 'RESET' }
  | { type: 'SET_KEYWORD'; payload: { keyword: string }}

export interface ProductDetailInterface {
  product: ProductInfoInterface
}

export interface ProductsWithCategoryDetailInterface {
  products: ProductInfoInterface[],
  pageTitle: string
}