/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { fetchAllArticleCategoriesAPI } from '~/apis/admin/articleCategory.api'
import { initialState, articleCategoryReducer } from '~/reducers/admin/articleCategory'
import type { ArticleCategoryActions, ArticleCategoryAllResponseInterface, ArticleCategoryStates } from '~/types/articleCategory.type'

interface ArticleCategoryContextType {
  stateArticleCategory: ArticleCategoryStates
  fetchArticleCategory: (params?: {
    status?: string
    page?: number
    keyword?: string
    sortKey?: string
    sortValue?: string
  }) => Promise<void>
  dispatchArticleCategory: React.Dispatch<ArticleCategoryActions>
}

const ArticleCategoryContext = createContext<ArticleCategoryContextType | null>(null)

export const ArticleCategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateArticleCategory, dispatchArticleCategory] = useReducer(articleCategoryReducer, initialState)

  const fetchArticleCategory = useCallback(
    async ({
      status = '',
      page = 1,
      keyword = '',
      sortKey = '',
      sortValue = ''
    } = {}) => {
      dispatchArticleCategory({ type: 'SET_LOADING', payload: true })
      try {
        const res: ArticleCategoryAllResponseInterface = await fetchAllArticleCategoriesAPI(
          status,
          page,
          keyword,
          sortKey,
          sortValue
        )
        dispatchArticleCategory({
          type: 'SET_DATA',
          payload: {
            articleCategories: res.articleCategories,
            allArticleCategories: res.allArticleCategories,
            accounts: res.accounts,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
            keyword: res.keyword,
            sortKey,
            sortValue
          }
        })
      } finally {
        dispatchArticleCategory({ type: 'SET_LOADING', payload: false })
      }
    }, [])
  // Gọi APi của article-category bên các trang khác
  useEffect(() => {
    fetchArticleCategory()
  }, [fetchArticleCategory])
  return (
    <ArticleCategoryContext.Provider value={{ stateArticleCategory, fetchArticleCategory, dispatchArticleCategory }}>
      {children}
    </ArticleCategoryContext.Provider>
  )
}

export const useArticleCategoryContext = () => {
  const context = useContext(ArticleCategoryContext)
  if (!context) throw new Error('useArticleCategoryContext must be used inside ArticleCategoryProvider')
  return context
}