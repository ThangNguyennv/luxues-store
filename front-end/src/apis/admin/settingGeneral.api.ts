import axios from 'axios'
import type { SettingGeneralDetailInterface } from '~/types/setting.type'
import { API_ROOT } from '~/utils/constants'

export const fetchSettingGeneralAPI = async (): Promise<SettingGeneralDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/settings/general`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditSettingGeneralAPI = async (formData: FormData) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/settings/general/edit`,
    formData,
    { withCredentials: true }
  )
  return response.data
}