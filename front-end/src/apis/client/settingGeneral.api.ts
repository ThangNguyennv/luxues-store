import axios from 'axios'
import type { SettingGeneralDetailInterface } from '~/types/setting.type'
import { API_ROOT } from '~/utils/constants'

export const fetchSettingGeneralAPI = async (): Promise<SettingGeneralDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/settings/general`
  )
  return response.data
}
