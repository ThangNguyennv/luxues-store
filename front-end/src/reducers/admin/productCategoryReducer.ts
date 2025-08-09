/* eslint-disable indent */
import type { ProductCategoryAction, ProductCategoryState } from '~/types'

export const initialState: ProductCategoryState = {
  products: [],
  accounts: [],
  filterStatus: [],
  pagination: null,
  keyword: '',
  sortKey: '',
  sortValue: '',
  loading: false
}

export function productCategoryReducer(
  stateProductCategory: ProductCategoryState,
  actionProductCategory: ProductCategoryAction
): ProductCategoryState {
  switch (actionProductCategory.type) {
    case 'SET_LOADING':
        return { ...stateProductCategory, loading: actionProductCategory.payload }
    case 'SET_DATA':
      return { ...stateProductCategory, ...actionProductCategory.payload }
    case 'RESET':
      return initialState
    default:
      return stateProductCategory
  }
}