import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useArticleContext } from '~/contexts/client/ArticleContext'

const useIndex = () => {
  const { stateArticle, fetchArticle } = useArticleContext()
  const { articles, pagination } = stateArticle
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''

  useEffect(() => {
    fetchArticle({
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentPage, currentKeyword, currentSortKey, currentSortValue, fetchArticle])

  const updateSearchParams = (key: string, value: string): void => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }

    // Nếu xóa sortKey hoặc sortValue → xóa cả 2
    if ((key === 'sortKey' || key === 'sortValue') && !value) {
      newParams.delete('sortKey')
      newParams.delete('sortValue')
    }

    setSearchParams(newParams)
  }

  return {
    articles,
    pagination,
    updateSearchParams
  }
}

export default useIndex