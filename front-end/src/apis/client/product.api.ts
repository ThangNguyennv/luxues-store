import axios from 'axios'
import type { ProductAllResponseInterface, ProductDetailInterface, ProductsWithCategoryDetailInterface } from '~/types/product.type'
import { API_ROOT } from '~/utils/constants'

export interface FetchProductParams {
  page?: number
  keyword?: string
  sortKey?: string
  sortValue?: string
  category?: string
  maxPrice?: string
  color?: string
  size?: string
}

export const fetchAllProductsAPI = async (
  params: FetchProductParams = {}
): Promise<ProductAllResponseInterface> => {
  const queryParams = new URLSearchParams()

  // Tự động thêm các tham số vào URL nếu chúng tồn tại
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)
  if (params.category) queryParams.set('category', params.category)
  if (params.maxPrice) queryParams.set('maxPrice', params.maxPrice)
  if (params.color) queryParams.set('color', params.color)
  if (params.size) queryParams.set('size', params.size)

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
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    }
  )
  return response.data
}

export const fetchTopRatedReviewsAPI = async () => {
  const response = await axios.get(`${API_ROOT}/products/reviews/top-rated`)
  return response.data
}

export const fetchFilterDataAPI = async () => {
  const response = await axios.get(
    `${API_ROOT}/products/filters`,
    { withCredentials: true }
  )
  return response.data // Sẽ trả về { filters: { categories, colors, sizes, maxPrice } }
}

