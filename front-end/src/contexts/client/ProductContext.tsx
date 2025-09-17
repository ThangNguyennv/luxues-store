/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchAllProductsAPI } from '~/apis/client/product.api'
import { initialState } from '~/reducers/client/productReducer'
import { productReducer } from '~/reducers/client/productReducer'
import type { ProductAllResponseInterface, ProductClientActions, ProductStates } from '~/types/product.type'

interface ProductContextType {
  stateProduct: ProductStates
  fetchProduct: (params?: {
    page?: number
    keyword?: string
    sortKey?: string
    sortValue?: string
  }) => Promise<void>
  dispatchProduct: React.Dispatch<ProductClientActions>
}

const ProductContext = createContext<ProductContextType | null>(null)

export const ProductClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProduct, dispatchProduct] = useReducer(productReducer, initialState)

  const fetchProduct = useCallback(
    async ({
      page = 1,
      keyword = '',
      sortKey = '',
      sortValue = ''
    } = {}) => {
      dispatchProduct({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductAllResponseInterface = await fetchAllProductsAPI(
          page,
          keyword,
          sortKey,
          sortValue
        )
        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            products: res.products,
            pagination: res.pagination,
            sortKey,
            sortValue
          }
        })
        dispatchProduct({
          type: 'SET_KEYWORD',
          payload: {
            keyword: res.keyword
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