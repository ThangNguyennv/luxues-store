import axios from 'axios'
import type { CartDetailInterface } from '~/types/cart.type'
import { API_ROOT } from '~/utils/constants'

export const fetchCartAPI = async (): Promise<CartDetailInterface> => {
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

export const fetchDeleteProductInCartAPI = async (productId: string) => {
  const response = await axios.delete(
    `${API_ROOT}/cart/delete/${productId}`,
    { withCredentials: true }
  )
  return response.data
}