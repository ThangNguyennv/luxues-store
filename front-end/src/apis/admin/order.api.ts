import axios from 'axios'
import type { OrderAllResponseInterface } from '~/types/order.type'
import { API_ROOT } from '~/utils/constants'

export const fetchOrdersAPI = async (
  status: string,
  page: number,
  currentKeyword: string,
  currentSortKey: string,
  currentSortValue: string
): Promise<OrderAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  if (currentSortKey) queryParams.set('sortKey', currentSortKey)
  if (currentSortValue) queryParams.set('sortValue', currentSortValue)

  const response = await axios.get(
    `${API_ROOT}/admin/orders?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/orders/change-status/${status}/${id}`,
    { status },
    { withCredentials: true }
  )
  return response.data
}