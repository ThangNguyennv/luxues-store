import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import type { ProductAllResponseInterface } from '~/components/Admin/Types/Interface'
import type { LoginResponseInterface } from '~/components/Admin/Types/Interface'

export const fetchProductAllAPI = async (status: string, page: number, currentKeyword: string): Promise<ProductAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  const response = await axios.get(`${API_ROOT}/admin/products?${queryParams.toString()}`,
    { withCredentials: true // Cho phép gửi cookie và nhận cookie từ server
    }
  )
  return response.data
}

export const fetchLoginAPI = async (email: string, password: string): Promise<LoginResponseInterface> => {
  const response = await axios.post(`${API_ROOT}/admin/auth/login`,
    { email, password }, {
      withCredentials: true // Cho phép gửi cookie và nhận cookie từ server
    })
  return response.data
}