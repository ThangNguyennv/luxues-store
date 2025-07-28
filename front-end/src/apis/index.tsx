import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import type { AccountInterface, DashboardInterface, LogoutResponseInterface, ProductInterface } from '~/components/Admin/Types/Interface'
import type { LoginResponseInterface } from '~/components/Admin/Types/Interface'
import type { ProductAllResponseInterface } from '~/components/Admin/Types/Interface'

export const fetchProductAllAPI = async (status: string, page: number, currentKeyword: string): Promise<ProductAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)

  const response = await axios.get(
    `${API_ROOT}/admin/products?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchLoginAPI = async (email: string, password: string): Promise<LoginResponseInterface> => {
  const response = await axios.post(
    `${API_ROOT}/admin/auth/login`,
    { email, password },
    { withCredentials: true }
  )
  return response.data
}

export const fetchLogoutAPI = async (): Promise<LogoutResponseInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/auth/logout`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDashboardAPI = async (): Promise<DashboardInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/dashboard`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchMyAccountAPI = async (): Promise<AccountInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/my-account`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchUpdateMyAccountAPI = async (formData: FormData) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/my-account/edit`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/products/change-status/${status}/${id}`,
    { status },
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailProductAPI = async (id: string): Promise<ProductInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/products/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditProductAPI = async (id: string, formData: FormData) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/products/edit/${id}`,
    formData,
    { withCredentials: true }
  )
  return response.data
}