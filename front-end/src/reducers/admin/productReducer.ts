/* eslint-disable indent */
import type { ProductActions, ProductStates } from '~/types/product.type'

export const initialState: ProductStates = {
  products: [],
  accounts: [],
  filterStatus: [],
  pagination: {
    currentPage: 1,
    limitItems: 3,
    skip: 0,
    totalPage: 0
  },
  keyword: '',
  sortKey: '',
  sortValue: '',
  loading: false,
  allProducts: []
}

export function productReducer(
  stateProduct: ProductStates,
  actionProduct: ProductActions
): ProductStates {
  switch (actionProduct.type) {
    case 'SET_LOADING':
      return { ...stateProduct, loading: actionProduct.payload }
    case 'SET_DATA':
      return { ...stateProduct, ...actionProduct.payload }
    case 'RESET':
          return initialState
    default:
      return stateProduct
  }
}