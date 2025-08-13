import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import type { ProductCategoryAllResponseInterface, ProductCategoryDetailInterface } from '~/types'

export const fetchAllProductCategoriesAPI = async (status: string, page: number, currentKeyword: string, currentSortKey: string, currentSortValue: string): Promise<ProductCategoryAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  if (currentSortKey) queryParams.set('sortKey', currentSortKey)
  if (currentSortValue) queryParams.set('sortValue', currentSortValue)

  const response = await axios.get(
    `${API_ROOT}/admin/products-category?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

// export const fetchChangeStatusAPI = async (status: string, id: string) => {
//   const response = await axios.patch(
//     `${API_ROOT}/admin/products-category/change-status/${status}/${id}`,
//     { status },
//     { withCredentials: true }
//   )
//   return response.data
// }

export const fetchDeleteProductCategoryAPI = async (id: string) => {
  const response = await axios.delete(
    `${API_ROOT}/admin/products-category/delete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailProductCategoryAPI = async (id: string): Promise<ProductCategoryDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/products-category/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditProductCategoryAPI = async (id: string, formData: FormData) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/products-category/edit/${id}`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateProductCategoryAPI = async (formData: FormData) => {
  const response = await axios.post(
    `${API_ROOT}/admin/products-category/create`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeStatusWithChildren = async (status: string, id: string) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/products-category/change-status-with-children/${status}/${id}`,
    {},
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/products-category/change-multi`,
    data,
    { withCredentials: true }
  )
  return response.data
}