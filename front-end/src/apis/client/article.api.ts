import axios from 'axios'
import type { ArticleAllResponseInterface, ArticlesWithCategoryDetailInterface } from '~/types/article.type'
import type { ArticleDetailInterface } from '~/types/article.type'
import { API_ROOT } from '~/utils/constants'

export const fetchAllArticlesAPI = async (
  status: string,
  page: number,
  currentKeyword: string,
  currentSortKey: string,
  currentSortValue: string
): Promise<ArticleAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  if (currentSortKey) queryParams.set('sortKey', currentSortKey)
  if (currentSortValue) queryParams.set('sortValue', currentSortValue)

  const response = await axios.get(
    `${API_ROOT}/articles?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchArticlesAPI = async (): Promise<ArticleAllResponseInterface> => {
  const response = await axios.get(
    `${API_ROOT}/articles`
  )
  return response.data
}

export const fetchDetailArticleAPI = async (id: string): Promise<ArticleDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/articles/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailArticleCategoryAPI = async (slugCategory: string): Promise<ArticlesWithCategoryDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/articles/${slugCategory}`,
    { withCredentials: true }
  )
  return response.data
}

