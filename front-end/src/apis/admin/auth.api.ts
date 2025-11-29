import type { LoginInterface, LogoutInterface } from '~/types/auth.type'
import { API_ROOT } from '~/utils/constants'
import axiosInstance from '~/apis/axiosInstance'
import { tokenManager } from '~/utils/tokenManager'

export const fetchLoginAPI = async (email: string, password: string): Promise<LoginInterface> => {
  const response = await axiosInstance.post(
    `${API_ROOT}/admin/auth/login`,
    { email, password }
  )
  // Lưu access token nếu login thành công
  if (response.data.accessToken) {
    tokenManager.setAccessToken(response.data.accessToken)
  }
  return response.data
}

export const fetchLogoutAPI = async (): Promise<LogoutInterface> => {
  const response = await axiosInstance.get(
    `${API_ROOT}/admin/auth/logout`,
    { withCredentials: true }
  )
  // Xóa access token
  tokenManager.clearAccessToken()
  return response.data
}