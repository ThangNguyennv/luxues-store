import { useEffect, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchChangeMultiAPI } from '~/apis/admin/order.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useOrderContext } from '~/contexts/admin/OrderContext'
import { useAuth } from '~/contexts/admin/AuthContext'

export const useOrder = () => {
  const { stateOrder, fetchOrder, dispatchOrder } = useOrderContext()
  const { orders, pagination, filterOrder, keyword } = stateOrder
  const { role } = useAuth()
  const { dispatchAlert } = useAlertContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actionType, setActionType] = useState('')
  const [open, setOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const currentStatus = searchParams.get('status') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''

  useEffect(() => {
    fetchOrder({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentStatus, currentPage, currentKeyword, currentSortKey, currentSortValue, fetchOrder])

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

  const reloadData = (): void => {
    fetchOrder({
      status: currentStatus,
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const typeChange = actionType
    if (selectedIds.length === 0) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn ít nhất một bản ghi!', severity: 'error' }
      })
      return
    }
    if (!typeChange) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn hành động!', severity: 'error' }
      })
      return
    }

    if (typeChange === 'delete-all') {
      setPendingAction('delete-all')
      setOpen(true)
      return
    }
    await executeAction(typeChange)
  }

  const executeAction = async (typeChange: string) => {
    const selectedOrders = orders.filter(order =>
      selectedIds.includes(order._id)
    )

    let result: string[] = []
    result = selectedOrders.map(order => order._id)

    const response = await fetchChangeMultiAPI({ ids: result, type: typeChange })

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
    setPendingAction(null)
    // Refetch
    reloadData()
  }
  const handleConfirmDeleteAll = async () => {
    if (pendingAction === 'delete-all') {
      await executeAction('delete-all')
    }
    setOpen(false)
  }

  const handleSort = (event: ChangeEvent<HTMLSelectElement>): void => {
    const [sortKey, sortValue] = event.currentTarget.value.split('-')
    if (sortKey && sortValue) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('sortKey', sortKey)
      newParams.set('sortValue', sortValue)
      setSearchParams(newParams)
    }
  }

  const clearSortParams = (): void => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('sortKey')
    newParams.delete('sortValue')
    setSearchParams(newParams)
  }

  const handleFilterStatus = (status: string): void => {
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
    dispatchOrder,
    orders,
    filterOrder,
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
    open,
    handleClose,
    handleConfirmDeleteAll,
    role
  }
}