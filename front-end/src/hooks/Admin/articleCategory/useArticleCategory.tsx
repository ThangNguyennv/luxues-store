import { useEffect, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchChangeMultiAPI } from '~/apis/admin/articleCategory.api'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategory'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'

export const useArticleCategory = () => {
  const { stateArticleCategory, fetchArticleCategory, dispatchArticleCategory } = useArticleCategoryContext()
  const { articleCategories, filterStatus, pagination, keyword } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const { role } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actionType, setActionType] = useState('')

  const currentStatus = searchParams.get('status') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''

  useEffect(() => {
    fetchArticleCategory({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentStatus, currentPage, currentKeyword, currentSortKey, currentSortValue, fetchArticleCategory])

  const updateSearchParams = (key: string, value: string) => {
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

  const reloadData = () => {
    fetchArticleCategory({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedIds.length) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn ít nhất một bản ghi!', severity: 'error' }
      })
      return
    }
    if (!actionType) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn hành động!', severity: 'error' }
      })
      return
    }
    if (actionType === 'delete-all' && !confirm('Bạn có chắc muốn xóa tất cả những danh mục bài viết này?')) {
      return
    }

    const selectedArticles = articleCategories.filter(articleCategory => selectedIds.includes(articleCategory._id))
    let result: string[] = []

    if (actionType === 'change-position') {
      result = selectedArticles.map(articleCategory => {
        const positionInput = document.querySelector<HTMLInputElement>(
          `input[name="position"][data-id="${articleCategory._id}"]`
        )
        return `${articleCategory._id}-${positionInput?.value || ''}`
      })
    } else {
      result = selectedArticles.map(articleCategory => articleCategory._id)
    }

    const response = await fetchChangeMultiAPI({ ids: result, type: actionType })

    if ([200, 204].includes(response.code)) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }

    setSelectedIds([])
    setActionType('')

    reloadData()
  }

  const handleSort = (event: ChangeEvent<HTMLSelectElement>) => {
    const [sortKey, sortValue] = event.currentTarget.value.split('-')
    if (sortKey && sortValue) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('sortKey', sortKey)
      newParams.set('sortValue', sortValue)
      setSearchParams(newParams)
    }
  }

  const clearSortParams = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('sortKey')
    newParams.delete('sortValue')
    setSearchParams(newParams)
  }

  const handleFilterStatus = (status: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (status) {
      newParams.set('status', status)
      newParams.set('page', '1')
    } else {
      newParams.delete('status')
    }
    setSearchParams(newParams)
  }

  return {
    dispatchArticleCategory,
    filterStatus,
    pagination,
    keyword,
    sortKey: currentSortKey,
    sortValue: currentSortValue,
    selectedIds,
    setSelectedIds,
    actionType,
    setActionType,
    currentStatus,
    updateSearchParams,
    handleSubmit,
    handleSort,
    clearSortParams,
    handleFilterStatus,
    articleCategories,
    role
  }
}