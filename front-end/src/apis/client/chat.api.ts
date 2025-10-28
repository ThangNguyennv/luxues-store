import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import type { ClientChatResponse } from '~/types/chat.type'

export const fetchClientChatAPI = async (): Promise<ClientChatResponse> => {
  const response = await axios.get(
    `${API_ROOT}/chats`,
    { withCredentials: true }
  )
  return response.data
}
