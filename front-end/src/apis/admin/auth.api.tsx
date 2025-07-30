import axios from 'axios'
import type { LoginResponseInterface, LogoutResponseInterface } from '~/components/Admin/Types/Interface'
import { API_ROOT } from '~/utils/constants'

export const fetchLoginAPI = async (email: string, password: string): Promise<LoginResponseInterface> => {
  const response = await axios.post(
    `${API_ROOT}/admin/auth/login`,
    { email, password },
    { withCredentials: true }
  )
  return response.data
}

export const fetchLogoutAPI = async (): Promise<LogoutResponseInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/auth/logout`,
    { withCredentials: true }
  )
  return response.data
}