import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchChangeMultiAPI } from '~/apis/admin/product.api'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'

export const useProductCategory = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const [actionType, setActionType] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''

  const { state, fetchData, dispatch } = useProductCategoryContext()
  const { products, accounts, filterStatus, pagination, keyword, loading } = state

  useEffect(() => {
    fetchData({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentStatus, currentPage, currentKeyword, currentSortKey, currentSortValue, fetchData])

  const updateSearchParams = useCallback(
    (key: string, value: string) => {
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
    },
    [searchParams, setSearchParams]
  )

  const showAlert = useCallback((message: string, severity: 'success' | 'error') => {
    setAlertMessage(message)
    setAlertSeverity(severity)
    setAlertOpen(true)
  }, [])

  const reloadData = useCallback(() => {
    fetchData({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentStatus, currentPage, currentKeyword, currentSortKey, currentSortValue, fetchData])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!selectedIds.length) {
        showAlert('Vui lòng chọn ít nhất một bản ghi!', 'error')
        return
      }
      if (!actionType) {
        showAlert('Vui lòng chọn hành động', 'error')
        return
      }
      if (actionType === 'delete-all' && !confirm('Bạn có chắc muốn xóa tất cả những sản phẩm này?')) {
        return
      }

      const selectedProducts = products.filter(p => selectedIds.includes(p._id))
      let result: string[] = []

      if (actionType === 'change-position') {
        result = selectedProducts.map(p => {
          const positionInput = document.querySelector<HTMLInputElement>(
            `input[name="position"][data-id="${p._id}"]`
          )
          return `${p._id}-${positionInput?.value || ''}`
        })
      } else {
        result = selectedProducts.map(p => p._id)
      }

      const response = await fetchChangeMultiAPI({ ids: result, type: actionType })

      showAlert(response.message, [200, 204].includes(response.code) ? 'success' : 'error')

      setSelectedIds([])
      setActionType('')
      reloadData()
    },
    [selectedIds, actionType, products, reloadData, showAlert]
  )

  const handleSort = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const [sortKey, sortValue] = event.currentTarget.value.split('-')
      if (sortKey && sortValue) {
        updateSearchParams('sortKey', sortKey)
        updateSearchParams('sortValue', sortValue)
      }
    },
    [updateSearchParams]
  )

  const clearSortParams = useCallback(() => {
    updateSearchParams('sortKey', '')
    updateSearchParams('sortValue', '')
  }, [updateSearchParams])

  return {
    dispatch,
    loading,
    products,
    accounts,
    filterStatus,
    pagination,
    keyword,
    sortKey: currentSortKey,
    sortValue: currentSortValue,
    selectedIds,
    setSelectedIds,
    alertOpen,
    alertMessage,
    alertSeverity,
    setAlertOpen,
    actionType,
    setActionType,
    currentStatus,
    currentPage,
    currentKeyword,
    updateSearchParams,
    handleSubmit,
    handleSort,
    clearSortParams
  }
}