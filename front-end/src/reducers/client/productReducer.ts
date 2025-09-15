/* eslint-disable indent */
import type { ProductClientActions, ProductStates } from '~/types/product.type'

export const initialState: ProductStates = {
  products: [],
  accounts: [],
  filterStatus: [],
  pagination:  {
    currentPage: 1,
    limitItems: 3,
    skip: 0,
    totalPage: 0
  },
  keyword: '',
  sortKey: '',
  sortValue: '',
  loading: false
}

export function productReducer(
  stateProduct: ProductStates,
  actionProduct: ProductClientActions
): ProductStates {
  switch (actionProduct.type) {
    case 'SET_LOADING':
      return { ...stateProduct, loading: actionProduct.payload }

    // Set toàn bộ data sau khi fetch API
    case 'SET_DATA':
      return {
        ...stateProduct,
        products: actionProduct.payload.products ?? stateProduct.products,
        accounts: actionProduct.payload.accounts ?? stateProduct.accounts,
        filterStatus: actionProduct.payload.filterStatus ?? stateProduct.filterStatus,
        pagination: actionProduct.payload.pagination ?? stateProduct.pagination,
        keyword: actionProduct.payload.keyword ?? stateProduct.keyword,
        sortKey: actionProduct.payload.sortKey ?? stateProduct.sortKey,
        sortValue: actionProduct.payload.sortValue ?? stateProduct.sortValue
      }

    // Chỉ update keyword
    case 'SET_KEYWORD':
      return { ...stateProduct, keyword: actionProduct.payload.keyword }

    case 'RESET':
      return initialState

    default:
      return stateProduct
  }
}