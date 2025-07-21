import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

import type { ProductAllResponse } from '../pages/Admin/Product/Product'

export const fetchProductAllAPI = async (status: string, page: number): Promise<ProductAllResponse> => {
  const queryStatus = status ? `status=${status}` : ''
  const queryPage = page ? `page=${page}` : '1'
  const response = await axios.get(`${API_ROOT}/admin/products?${queryStatus}&${queryPage}`)
  return response.data
}
