import axios from 'axios'
import type { LoginInterface, LogoutInterface } from '~/types/auth.type'
import { API_ROOT } from '~/utils/constants'

export const fetchLoginAPI = async (email: string, password: string): Promise<LoginInterface> => {
  const response = await axios.post(
    `${API_ROOT}/admin/auth/login`,
    { email, password },
    { withCredentials: true }
  )
  return response.data
}

export const fetchLogoutAPI = async (): Promise<LogoutInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/auth/logout`,
    { withCredentials: true }
  )
  return response.data
}