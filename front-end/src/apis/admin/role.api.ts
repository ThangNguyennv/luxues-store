import axios from 'axios'
import type { RolesDetailInterface, RolesInfoInterface, RolesResponseInterface } from '~/types/role.type'
import { API_ROOT } from '~/utils/constants'

export const fetchRoleAPI = async (): Promise<RolesResponseInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/roles`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailRoleAPI = async (id: string): Promise<RolesDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/roles/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateRoleAPI = async (data: RolesInfoInterface) => {
  const response = await axios.post(
    `${API_ROOT}/admin/roles/create`,
    data,
    { withCredentials: true }
  )
  return response.data
}