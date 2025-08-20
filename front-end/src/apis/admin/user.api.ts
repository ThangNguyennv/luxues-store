import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const fetchUsersAPI = async () => {
  const response = await axios.get(
    `${API_ROOT}/admin/users`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeStatusAPI = async (id: string, status: string) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/users/change-status/${status}/${id}`,
    { status },
    { withCredentials: true }
  )
  return response.data
}

export const fetchDeleteUserAPI = async (id: string) => {
  const response = await axios.delete(
    `${API_ROOT}/admin/users/delete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailUserAPI = async (id: string) => {
  const response = await axios.get(
    `${API_ROOT}/admin/users/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}