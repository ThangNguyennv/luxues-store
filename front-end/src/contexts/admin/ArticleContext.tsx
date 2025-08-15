/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchAllArticlesAPI } from '~/apis/admin/article.api'
import { articleReducer } from '~/reducers/admin/articleReducer'
import { initialState } from '~/reducers/admin/articleReducer'
import type { ArticleActions, ArticleAllResponseInterface, ArticleStates } from '~/types/article.type'

interface ArticleContextType {
  stateArticle: ArticleStates
  fetchArticle: (params?: {
    status?: string
    page?: number
    keyword?: string
    sortKey?: string
    sortValue?: string
  }) => Promise<void>
  dispatchArticle: React.Dispatch<ArticleActions>
}

const ArticleContext = createContext<ArticleContextType | null>(null)

export const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateArticle, dispatchArticle] = useReducer(articleReducer, initialState)

  const fetchArticle = useCallback(
    async ({
      status = '',
      page = 1,
      keyword = '',
      sortKey = '',
      sortValue = ''
    } = {}) => {
      dispatchArticle({ type: 'SET_LOADING', payload: true })
      try {
        const res: ArticleAllResponseInterface = await fetchAllArticlesAPI(
          status,
          page,
          keyword,
          sortKey,
          sortValue
        )
        dispatchArticle({
          type: 'SET_DATA',
          payload: {
            articles: res.articles,
            accounts: res.accounts,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
            keyword: res.keyword,
            sortKey,
            sortValue
          }
        })
      } finally {
        dispatchArticle({ type: 'SET_LOADING', payload: false })
      }
    }, [])
  return (
    <ArticleContext.Provider value={{ stateArticle, fetchArticle, dispatchArticle }}>
      {children}
    </ArticleContext.Provider>
  )
}

export const useArticleContext = () => {
  const context = useContext(ArticleContext)
  if (!context) throw new Error('useProductContext must be used inside ProductProvider')
  return context
}