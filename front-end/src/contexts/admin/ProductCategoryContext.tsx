/* eslint-disable no-unused-vars */
// ProductCategoryContext.tsx
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchProductCategoryAllAPI } from '~/apis/admin/product.api'
import { initialState, productCategoryReducer } from '~/reducers/admin/productCategoryReducer'
import type { ProductCategoryAction, ProductCategoryAllResponseInterface, ProductCategoryState } from '~/types'

interface ProductCategoryContextType {
  stateProductCategory: ProductCategoryState
  fetchData: (params?: {
    status?: string
    page?: number
    keyword?: string
    sortKey?: string
    sortValue?: string
  }) => Promise<void>
  dispatch: React.Dispatch<ProductCategoryAction>
}

const ProductCategoryContext = createContext<ProductCategoryContextType | null>(null)

export const ProductCategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProductCategory, dispatch] = useReducer(productCategoryReducer, initialState)

  const fetchData = useCallback(
    async ({
      status = '',
      page = 1,
      keyword = '',
      sortKey = '',
      sortValue = ''
    } = {}) => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductCategoryAllResponseInterface = await fetchProductCategoryAllAPI(
          status,
          page,
          keyword,
          sortKey,
          sortValue
        )
        dispatch({
          type: 'SET_DATA',
          payload: {
            products: res.records,
            accounts: res.account,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
            keyword: res.currentKeyword,
            sortKey,
            sortValue
          }
        })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    []
  )

  return (
    <ProductCategoryContext.Provider value={{ stateProductCategory, fetchData, dispatch }}>
      {children}
    </ProductCategoryContext.Provider>
  )
}

export const useProductCategoryContext = () => {
  const context = useContext(ProductCategoryContext)
  if (!context) throw new Error('useProductCategoryContext must be used inside ProductCategoryProvider')
  return context
}