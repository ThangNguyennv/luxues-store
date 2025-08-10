/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchProductAllAPI } from '~/apis/admin/product.api'
import { initialState } from '~/reducers/admin/productReducer'
import { productReducer } from '~/reducers/admin/productReducer'
import type { ProductActions, ProductAllResponseInterface, ProductStates } from '~/types'

interface ProductContextType {
  stateProduct: ProductStates
  fetchProduct: (params?: {
    status?: string
    page?: number
    keyword?: string
    sortKey?: string
    sortValue?: string
  }) => Promise<void>
  dispatchProduct: React.Dispatch<ProductActions>
}

const ProductContext = createContext<ProductContextType | null>(null)

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProduct, dispatchProduct] = useReducer(productReducer, initialState)

  const fetchProduct = useCallback(
    async ({
      status = '',
      page = 1,
      keyword = '',
      sortKey = '',
      sortValue = ''
    } = {}) => {
      dispatchProduct({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductAllResponseInterface = await fetchProductAllAPI(
          status,
          page,
          keyword,
          sortKey,
          sortValue
        )
        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            products: res.products,
            accounts: res.accounts,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
            keyword: res.keyword,
            sortKey,
            sortValue
          }
        })
      } finally {
        dispatchProduct({ type: 'SET_LOADING', payload: false })
      }
    }, [])
  return (
    <ProductContext.Provider value={{ stateProduct, fetchProduct, dispatchProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProductContext must be used inside ProductProvider')
  return context
}