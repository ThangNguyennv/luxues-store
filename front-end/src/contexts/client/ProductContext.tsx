/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { fetchAllProductsAPI } from '~/apis/client/product.api'
import { initialState } from '~/reducers/admin/productReducer'
import { productReducer } from '~/reducers/admin/productReducer'
import type { ProductActions, ProductAllResponseInterface, ProductStates } from '~/types/product.type'

interface ProductContextType {
  stateProduct: ProductStates
  fetchProduct: (params?: {
    page?: number
    keyword?: string
    sortKey?: string
    sortValue?: string
  }) => Promise<void>
  dispatchProduct: React.Dispatch<ProductActions>
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
            keyword: res.keyword,
            sortKey,
            sortValue
          }
        })
      } finally {
        dispatchProduct({ type: 'SET_LOADING', payload: false })
      }
    }, [])
  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])
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