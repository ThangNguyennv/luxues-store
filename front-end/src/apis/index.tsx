import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

import type { Pagination, ProductInterface } from '../pages/Admin/Product/Product'
import type { FilterStatus } from '../pages/Admin/Product/Product'

export const fetchProductAPI = async (status: string): Promise<ProductInterface[]> => {
  const query = status ? `status=${status}` : ''
  const response = await axios.get(`${API_ROOT}/admin/products?${query}`)
  return response.data.products
}

export const fetchFilterstatusAPI = async (): Promise<FilterStatus[]> => {
  const response = await axios.get(`${API_ROOT}/admin/products`)
  return response.data.filterStatus
}

export const fetchPaginationAPI = async (): Promise<Pagination> => {
  const response = await axios.get(`${API_ROOT}/admin/products`)
  return response.data.pagination
}

