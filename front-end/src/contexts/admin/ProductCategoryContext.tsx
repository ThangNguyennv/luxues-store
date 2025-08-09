/* eslint-disable no-unused-vars */
// ProductCategoryContext.tsx
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { fetchProductCategoryAllAPI } from '~/apis/admin/product.api'
import { initialState, productCategoryReducer } from '~/reducers/admin/productCategoryReducer'
import type { ProductCategoryActions, ProductCategoryAllResponseInterface, ProductCategoryStates } from '~/types'

interface ProductCategoryContextType {
  stateProductCategory: ProductCategoryStates
  fetchProductCategory: (params?: {
    status?: string
    page?: number
    keyword?: string
    sortKey?: string
    sortValue?: string
  }) => Promise<void>
  dispatchProductCategory: React.Dispatch<ProductCategoryActions>
}

const ProductCategoryContext = createContext<ProductCategoryContextType | null>(null)

export const ProductCategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProductCategory, dispatchProductCategory] = useReducer(productCategoryReducer, initialState)

  const fetchProductCategory = useCallback(
    async ({
      status = '',
      page = 1,
      keyword = '',
      sortKey = '',
      sortValue = ''
    } = {}) => {
      dispatchProductCategory({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductCategoryAllResponseInterface = await fetchProductCategoryAllAPI(
          status,
          page,
          keyword,
          sortKey,
          sortValue
        )
        dispatchProductCategory({
          type: 'SET_DATA',
          payload: {
            productCategories: res.productCategories,
            accounts: res.accounts,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
            keyword: res.keyword,
            sortKey,
            sortValue
          }
        })
      } finally {
        dispatchProductCategory({ type: 'SET_LOADING', payload: false })
      }
    }, [])
  useEffect(() => {
    fetchProductCategory()
  }, [fetchProductCategory])
  return (
    <ProductCategoryContext.Provider value={{ stateProductCategory, fetchProductCategory, dispatchProductCategory }}>
      {children}
    </ProductCategoryContext.Provider>
  )
}

export const useProductCategoryContext = () => {
  const context = useContext(ProductCategoryContext)
  if (!context) throw new Error('useProductCategoryContext must be used inside ProductCategoryProvider')
  return context
}