import axios from 'axios'
import type { ArticleCategoryAllResponseInterface, ArticleCategoryDetailInterface } from '~/types/articleCategory.type'
import { API_ROOT } from '~/utils/constants'

export const fetchAllArticleCategoriesAPI = async (
  status: string,
  page: number,
  currentKeyword: string,
  currentSortKey: string,
  currentSortValue: string
): Promise<ArticleCategoryAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  if (currentSortKey) queryParams.set('sortKey', currentSortKey)
  if (currentSortValue) queryParams.set('sortValue', currentSortValue)

  const response = await axios.get(
    `${API_ROOT}/admin/articles-category?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDeleteArticleCategoryAPI = async (id: string) => {
  const response = await axios.delete(
    `${API_ROOT}/admin/articles-category/delete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailArticleCategoryAPI = async (id: string): Promise<ArticleCategoryDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/articles-category/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditArticleCategoryAPI = async (id: string, formData: FormData) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/articles-category/edit/${id}`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateArticleCategoryAPI = async (formData: FormData) => {
  const response = await axios.post(
    `${API_ROOT}/admin/articles-category/create`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeStatusWithChildren = async (status: string, id: string) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/articles-category/change-status-with-children/${status}/${id}`,
    {},
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await axios.patch(
    `${API_ROOT}/admin/articles-category/change-multi`,
    data,
    { withCredentials: true }
  )
  return response.data
}