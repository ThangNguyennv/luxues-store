import type { DashboardInterface } from '~/types/dashboard.type'
import { API_ROOT } from '~/utils/constants'
import axiosInstance from '../axiosInstance'

export const fetchDashboardAPI = async (): Promise<DashboardInterface> => {
  const response = await axiosInstance.get(
    `${API_ROOT}/admin/dashboard`,
    { withCredentials: true }
  )
  return response.data
}