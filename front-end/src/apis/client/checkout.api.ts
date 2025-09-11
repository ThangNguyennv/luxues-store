import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const fetchOrderAPI = async (formData: {position: number, fullname: string, phone: string, address: string }) => {
  const response = await axios.post(
    `${API_ROOT}/checkout/order`,
    formData,
    { withCredentials: true }
  )
  return response.data
}