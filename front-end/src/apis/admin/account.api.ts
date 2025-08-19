import axios from 'axios'
import type { AccountDetailInterface } from '~/types/account.type'
import { API_ROOT } from '~/utils/constants'

export const fetchAccountsAPI = async (): Promise<AccountDetailInterface> => {
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