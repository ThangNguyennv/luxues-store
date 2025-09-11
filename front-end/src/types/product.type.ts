import type { CurrentParamsInterface, GeneralInfoInterface, HelperInterface, ParamsInterface } from './helper.type'

export interface ProductInfoInterface extends GeneralInfoInterface {
  price: number,
  discountPercentage: number,
  stock: number,
  accountFullName: string,
  featured: string,
  product_category_id: string,
  description: string,
}

export interface ProductAllResponseInterface extends HelperInterface, CurrentParamsInterface {
  products: ProductInfoInterface[],
  allProducts: ProductInfoInterface[]
}

export interface ProductStates extends HelperInterface, ParamsInterface {
  products: ProductInfoInterface[],
}

export type ProductActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductStates> }
  | { type: 'RESET' }

export interface ProductDetailInterface {
  product: ProductInfoInterface
}

