import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const fetchCartAPI = async () => {
  const response = await axios.get(
    `${API_ROOT}/cart`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchAddProductToCartAPI = async (productId: string, quantity: string) => {
  const response = await axios.post(
    `${API_ROOT}/cart/add/${productId}`,
    { quantity },
    { withCredentials: true }
  )
  return response.data
}