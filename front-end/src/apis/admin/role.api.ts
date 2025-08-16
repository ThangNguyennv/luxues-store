import axios from 'axios'
import type { RolesResponseInterface } from '~/types/role.type'
import { API_ROOT } from '~/utils/constants'

export const fetchRoleAPI = async (): Promise<RolesResponseInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/roles`,
    { withCredentials: true }
  )
  return response.data
}