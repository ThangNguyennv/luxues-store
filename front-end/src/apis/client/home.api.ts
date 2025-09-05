import axios from 'axios'
import type { HomeInterface } from '~/types/home.type'
import { API_ROOT } from '~/utils/constants'

export const fetchHomeAPI = async (): Promise<HomeInterface> => {
  const response = await axios.get(
    `${API_ROOT}/`
  )
  return response.data
}