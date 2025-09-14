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

export const fetchAddProductToCartAPI = async (productId: string, quantity: number) => {
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

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await axios.patch(
    `${API_ROOT}/cart/change-multi`,
    data,
    { withCredentials: true }
  )
  return response.data
}