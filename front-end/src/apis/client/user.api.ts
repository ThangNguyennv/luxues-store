import axios from 'axios'
import type { UserDetailInterface } from '~/types/user.type'
import { API_ROOT } from '~/utils/constants'

export const fetchInfoUserAPI = async (): Promise<UserDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/user/info`,
    { withCredentials: true }
  )
  return response.data
}
