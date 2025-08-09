import { useEffect, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchChangeMultiAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/admin/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'

export const useProductCategory = () => {
  const { stateProductCategory, fetchProductCategory, dispatchProductCategory } = useProductCategoryContext()
  const { productCategories, accounts, filterStatus, pagination, keyword, loading } = stateProductCategory
  const { dispatchAlert } = useAlertContext()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actionType, setActionType] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''

  useEffect(() => {
    fetchProductCategory({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentStatus, currentPage, currentKeyword, currentSortKey, currentSortValue, fetchProductCategory])

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
    fetchProductCategory({
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
    if (actionType === 'delete-all' && !confirm('Bạn có chắc muốn xóa tất cả những sản phẩm này?')) {
      return
    }

    const selectedProducts = productCategories.filter(productCategory => selectedIds.includes(productCategory._id))
    let result: string[] = []

    if (actionType === 'change-position') {
      result = selectedProducts.map(productCategory => {
        const positionInput = document.querySelector<HTMLInputElement>(
          `input[name="position"][data-id="${productCategory._id}"]`
        )
        return `${productCategory._id}-${positionInput?.value || ''}`
      })
    } else {
      result = selectedProducts.map(productCategory => productCategory._id)
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
      updateSearchParams('sortKey', sortKey)
      updateSearchParams('sortValue', sortValue)
    }
  }

  const clearSortParams = () => {
    updateSearchParams('sortKey', '')
    updateSearchParams('sortValue', '')
  }

  return {
    dispatchProductCategory,
    loading,
    productCategories,
    accounts,
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
    currentPage,
    currentKeyword,
    updateSearchParams,
    handleSubmit,
    handleSort,
    clearSortParams
  }
}