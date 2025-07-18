import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

import type { ProductInterface } from '../pages/Admin/Product/Product'

export const fetchProductAPI = async (): Promise<ProductInterface[]> => {
  const result = await axios.get(`${API_ROOT}/admin/products`)
  return result.data.products
}