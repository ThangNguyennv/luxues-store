/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
// 1. Import FetchProductParams
import { fetchAllProductsAPI, type FetchProductParams } from '~/apis/client/product.api'
import { initialState } from '~/reducers/client/productReducer'
import { productReducer } from '~/reducers/client/productReducer'
import type { ProductAllResponseInterface, ProductClientActions, ProductStates } from '~/types/product.type'

interface ProductContextType {
  stateProduct: ProductStates
  fetchProduct: (params?: FetchProductParams) => Promise<void>
  dispatchProduct: React.Dispatch<ProductClientActions>
}

const ProductContext = createContext<ProductContextType | null>(null)

export const ProductClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProduct, dispatchProduct] = useReducer(productReducer, initialState)

  const fetchProduct = useCallback(
    // 3. Cập nhật tham số đầu vào
    async (params: FetchProductParams = {}) => {
      dispatchProduct({ type: 'SET_LOADING', payload: true })
      try {
        // 4. Truyền thẳng object params vào API
        const res: ProductAllResponseInterface = await fetchAllProductsAPI(params)

        // 5. Cập nhật payload để lưu tất cả trạng thái filter vào state
        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            allProducts: res.allProducts,
            products: res.products,
            pagination: res.pagination,
            keyword: params.keyword || '',
            sortKey: params.sortKey || '',
            sortValue: params.sortValue || '',
            category: params.category || '',
            maxPrice: params.maxPrice || '',
            color: params.color || '',
            size: params.size || ''
          }
        })
      } finally {
        dispatchProduct({ type: 'SET_LOADING', payload: false })
      }
    }, []) // useCallback vẫn an toàn với mảng rỗng vì fetchAllProductsAPI đã được import

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

