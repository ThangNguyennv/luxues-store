import axios from 'axios'
import type { DashboardInterface } from '~/types'
import { API_ROOT } from '~/utils/constants'

export const fetchDashboardAPI = async (): Promise<DashboardInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/dashboard`,
    { withCredentials: true }
  )
  return response.data
}