import type { CurrentParamsInterface, GeneralInfoInterface, HelperInterface, ParamsInterface } from './helper.type'

export interface ProductInfoInterface extends GeneralInfoInterface {
  price: number,
  discountPercentage: number,
  stock: number,
  accountFullName: string,
  featured: string,
  product_category_id: string,
  description: string,
  colors: {
    name: string
    code: string,
    images: (File | string)[]
  }[]
  sizes: string[],
  stars: {
    average: number,
    count: number
  }
}

export interface ProductAllResponseInterface extends HelperInterface, CurrentParamsInterface {
  products: ProductInfoInterface[],
  allProducts: ProductInfoInterface[]
}

export interface ProductStates extends HelperInterface, ParamsInterface {
  products: ProductInfoInterface[],
  allProducts: ProductInfoInterface[]
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