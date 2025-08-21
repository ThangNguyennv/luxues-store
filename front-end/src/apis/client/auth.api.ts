import axios from 'axios'
import type { LoginInterface } from '~/types/auth.type'
import { API_ROOT } from '~/utils/constants'

export const fetchLoginAPI = async (email: string, password: string): Promise<LoginInterface> => {
  const response = await axios.post(
    `${API_ROOT}/user/login`,
    { email, password },
    { withCredentials: true }
  )
  return response.data
}

export const fetchRegisterAPI = async (fullName: string, email: string, password: string, confirmPassword: string): Promise<LoginInterface> => {
  const response = await axios.post(
    `${API_ROOT}/user/register`,
    { fullName, email, password, confirmPassword },
    { withCredentials: true }
  )
  return response.data
}