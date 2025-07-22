import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import type { ProductAllResponseInterface } from '~/components/Admin/Types/Interface'

export const fetchProductAllAPI = async (status: string, page: number, currentKeyword: string): Promise<ProductAllResponseInterface> => {
  const queryStatus = status ? `status=${status}` : ''
  const queryPage = page ? `page=${page}` : '1'
  const queryKeyword = currentKeyword ? `keyword=${currentKeyword}` : ''
  const response = await axios.get(`${API_ROOT}/admin/products?${queryStatus}&${queryPage}&${queryKeyword}`)
  return response.data
}
