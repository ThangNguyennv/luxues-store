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

export const fetchSearchSuggestionsAPI = async (keyword: string) => {
  const response = await axios.get(
    `${API_ROOT}/products/suggestions?keyword=${keyword}`
  )
  return response.data
}

export const fetchRelatedProductsAPI = async (productId: string) => {
  const response = await axios.get(`${API_ROOT}/products/related/${productId}`)
  return response.data
}

export const submitReviewAPI = async (productId: string, formData: FormData) => {
  const response = await axios.post(
    `${API_ROOT}/products/${productId}/reviews`,
    formData,
    {
      headers: {
        // Rất quan trọng khi gửi FormData chứa file
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true // Để gửi cookie xác thực người dùng
    }
  )
  return response.data
}

export const fetchTopRatedReviewsAPI = async () => {
  const response = await axios.get(`${API_ROOT}/products/reviews/top-rated`)
  return response.data // Trả về { code, message, reviews }
}
