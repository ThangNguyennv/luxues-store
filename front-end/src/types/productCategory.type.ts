import type { ProductCurrentParamsInterface, ProductGeneralInfoInterface, ProductHelperInterface, ProductParamsInterface } from './product.type'

export interface ProductCategoryInfoInterface extends ProductGeneralInfoInterface {
  children: ProductCategoryInfoInterface[] | [],
  parent_id: string
}

export interface ProductCategoryAllResponseInterface extends ProductHelperInterface, ProductCurrentParamsInterface {
  productCategories: ProductCategoryInfoInterface[],
  allProductCategories: ProductCategoryInfoInterface[]
}

export interface ProductCategoryStates extends ProductHelperInterface, ProductParamsInterface {
  productCategories: ProductCategoryInfoInterface[],
  allProductCategories: ProductCategoryInfoInterface[],
}

export type ProductCategoryActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductCategoryStates> }
  | { type: 'RESET' }

export interface ProductCategoryDetailInterface {
    productCategory: ProductCategoryInfoInterface
}