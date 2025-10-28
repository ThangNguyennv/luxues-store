import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import type { AdminChatRoomsResponse, AdminChatHistoryResponse } from '~/types/chat.type'

export const fetchAdminChatRoomsAPI = async (): Promise<AdminChatRoomsResponse> => {
  const response = await axios.get(
    `${API_ROOT}/admin/chats`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchAdminChatHistoryAPI = async (userId: string): Promise<AdminChatHistoryResponse> => {
  const response = await axios.get(
    `${API_ROOT}/admin/chats/${userId}`,
    { withCredentials: true }
  )
  return response.data
}
