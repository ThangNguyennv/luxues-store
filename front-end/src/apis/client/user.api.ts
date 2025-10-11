import axios from 'axios'
import type { OrderInfoInterface } from '~/types/order.type'
import type { UserDetailInterface } from '~/types/user.type'
import { API_ROOT } from '~/utils/constants'

export const fetchInfoUserAPI = async (): Promise<UserDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/user/account/info`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditInfoUserAPI = async (formData: FormData): Promise<UserDetailInterface> => {
  const response = await axios.patch(
    `${API_ROOT}/user/account/info/edit`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangePasswordInfoUserAPI = async (currentPassword: string, password: string, confirmPassword: string): Promise<UserDetailInterface> => {
  const response = await axios.patch(
    `${API_ROOT}/user/account/info/change-password`,
    { currentPassword, password, confirmPassword },
    { withCredentials: true }
  )
  return response.data
}

export const fetchMyOrdersAPI = async (): Promise<OrderInfoInterface> => {
  const response = await axios.get(
    `${API_ROOT}/user/account/my-orders`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCancelOrder = async (id: string) => {
  const response = await axios.patch(
    `${API_ROOT}/user/my-orders/cancel-order/${id}`,
    {},
    { withCredentials: true }
  )
  return response.data
}