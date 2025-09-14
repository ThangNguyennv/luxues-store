import axios from 'axios'
import type { ProductAllResponseInterface, ProductDetailInterface, ProductsWithCategoryDetailInterface } from '~/types/product.type'
import { API_ROOT } from '~/utils/constants'

export const fetchAllProductsAPI = async (
  page: number,
  currentKeyword: string,
  currentSortKey: string,
  currentSortValue: string
): Promise<ProductAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  if (currentSortKey) queryParams.set('sortKey', currentSortKey)
  if (currentSortValue) queryParams.set('sortValue', currentSortValue)

  const response = await axios.get(
    `${API_ROOT}/products?${queryParams.toString()}`
  )
  return response.data
}

export const fetchProductsAPI = async (): Promise<ProductAllResponseInterface> => {
  const response = await axios.get(
    `${API_ROOT}/products`
  )
  return response.data
}

export const fetchDetailProductAPI = async (slugProduct: string): Promise<ProductDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/products/detail/${slugProduct}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailProductCategoryAPI = async (slugCategory: string): Promise<ProductsWithCategoryDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/products/${slugCategory}`,
    { withCredentials: true }
  )
  return response.data
}