import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import type { ProductAllResponseInterface, ProductCategoryAllResponseInterface, ProductDetailInterface } from '~/types'

export const fetchProductAllAPI = async (status: string, page: number, currentKeyword: string, currentSortKey: string, currentSortValue: string): Promise<ProductAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  if (currentSortKey) queryParams.set('sortKey', currentSortKey)
  if (currentSortValue) queryParams.set('sortValue', currentSortValue)

  const response = await axios.get(
    `${API_ROOT}/admin/products?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchProductCategoryAllAPI = async (status: string, page: number, currentKeyword: string, currentSortKey: string, currentSortValue: string): Promise<ProductCategoryAllResponseInterface> => {
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

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/products/change-status/${status}/${id}`,
    { status },
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailProductAPI = async (id: string): Promise<ProductDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/products/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditProductAPI = async (id: string, formData: FormData) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/products/edit/${id}`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDeleteProductAPI = async (id: string) => {
  const response = await axios.delete(
    `${API_ROOT}/admin/products/delete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/products/change-multi`,
    data,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateProductAPI = async (formData: FormData) => {
  const response = await axios.post(
    `${API_ROOT}/admin/products/create`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

