import type { MyAccountDetailInterface } from '~/types/account.type'
import { API_ROOT } from '~/utils/constants'
import axiosInstance from '../axiosInstance'

export const fetchMyAccountAPI = async (): Promise<MyAccountDetailInterface> => {
  const response = await axiosInstance.get(
    `${API_ROOT}/admin/my-account`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchUpdateMyAccountAPI = async (formData: FormData) => {
  const response = await axiosInstance.patch(
    `${API_ROOT}/admin/my-account/edit`,
    formData,
    { withCredentials: true }
  )
  return response.data
}