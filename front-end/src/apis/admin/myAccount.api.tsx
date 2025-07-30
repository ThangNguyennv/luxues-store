import axios from 'axios'
import type { AccountInterface } from '~/components/Admin/Types/Interface'
import { API_ROOT } from '~/utils/constants'

export const fetchMyAccountAPI = async (): Promise<AccountInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/my-account`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchUpdateMyAccountAPI = async (formData: FormData) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/my-account/edit`,
    formData,
    { withCredentials: true }
  )
  return response.data
}