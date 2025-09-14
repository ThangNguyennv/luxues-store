import type { CurrentParamsInterface, GeneralInfoInterface, HelperInterface, ParamsInterface } from './helper.type'

export interface ProductCategoryInfoInterface extends GeneralInfoInterface {
  children: ProductCategoryInfoInterface[] | [],
  parent_id: string,
  description: string,
}

export interface ProductCategoryAllResponseInterface extends HelperInterface, CurrentParamsInterface {
  productCategories: ProductCategoryInfoInterface[],
  allProductCategories: ProductCategoryInfoInterface[]
}

export interface ProductCategoryStates extends HelperInterface, ParamsInterface {
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