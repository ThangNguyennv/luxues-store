import axios from 'axios'
import type { AccountDetailInterface, AccountsDetailInterface } from '~/types/account.type'
import { API_ROOT } from '~/utils/constants'

export const fetchAccountsAPI = async (): Promise<AccountsDetailInterface> => {
  const resposne = await axios.get(
    `${API_ROOT}/admin/accounts`,
    { withCredentials: true }
  )
  return resposne.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/accounts/change-status/${status}/${id}`,
    { status },
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateAccountAPI = async (formData: FormData) => {
  const response = await axios.post(
    `${API_ROOT}/admin/accounts/create`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailAccountAPI = async (id: string): Promise<AccountDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/accounts/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditAccountAPI = async (id: string, formData: FormData) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/accounts/edit/${id}`,
    formData,
    { withCredentials: true }
  )
  return response.data
}