import axios from 'axios'
import type { OrderDetailInterface } from '~/types/order.type'
import { API_ROOT } from '~/utils/constants'

export const fetchOrderAPI = async (formData: {position: number, fullname: string, phone: string, address: string }) => {
  const response = await axios.post(
    `${API_ROOT}/checkout/order`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchSuccessAPI = async (orderId: string): Promise<OrderDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/checkout/success/${orderId}`,
    { withCredentials: true }
  )
  return response.data
}