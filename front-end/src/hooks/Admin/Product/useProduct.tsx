import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchChangeMultiAPI, fetchProductAllAPI } from '~/apis/admin/product.api'
import type {
  ProductAllResponseInterface,
  ProductDetailInterface,
  FilterStatusInterface,
  PaginationInterface
} from '~/components/Admin/Types/Interface'

export const useProductAdmin = () => {
  const [products, setProducts] = useState<ProductDetailInterface[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatusInterface[]>([])
  const [pagination, setPagination] = useState<PaginationInterface | null>(null)
  const [keyword, setKeyword] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const [actionType, setActionType] = useState('')

  const currentStatus = searchParams.get('status') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''

  useEffect(() => {
    fetchProductAllAPI(currentStatus, currentPage, currentKeyword).then((res: ProductAllResponseInterface) => {
      setProducts(res.products)
      setPagination(res.pagination)
      setFilterStatus(res.filterStatus)
      setKeyword(res.currentKeyword)
    })
  }, [currentStatus, currentPage, currentKeyword])

  const updateSearchParams = (key: string, value: string): void => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const typeChange = actionType
    if (selectedIds.length === 0) {
      showAlert('Vui lòng chọn ít nhất một bản ghi!', 'error')
      return
    }

    if (!typeChange) {
      showAlert('Vui lòng chọn hành động', 'error')
      return
    }

    if (typeChange === 'delete-all') {
      const isConfirm = confirm('Bạn có chắc muốn xóa tất cả những sản phẩm này?')
      if (!isConfirm) return
    }

    const selectedProducts = products.filter(product =>
      selectedIds.includes(product._id)
    )

    let result: string[] = []
    if (typeChange === 'change-position') {
      result = selectedProducts.map(product => {
        const positionInput = document.querySelector<HTMLInputElement>(
          `input[name="position"][data-id="${product._id}"]`
        )
        const position = positionInput?.value || ''
        return `${product._id}-${position}`
      })
    } else {
      result = selectedProducts.map(product => product._id)
    }

    const response = await fetchChangeMultiAPI({ ids: result, type: typeChange })

    if ([200, 204].includes(response.code)) {
      showAlert(response.message, 'success')
    } else {
      showAlert(response.message, 'error')
    }

    setSelectedIds([])
    setActionType('')

    // Refetch
    const res = await fetchProductAllAPI(currentStatus, currentPage, currentKeyword)
    setProducts(res.products)
    setPagination(res.pagination)
    setFilterStatus(res.filterStatus)
    setKeyword(res.currentKeyword)
  }

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message)
    setAlertSeverity(severity)
    setAlertOpen(true)
  }

  return {
    products,
    filterStatus,
    pagination,
    keyword,
    setKeyword,
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
    handleSubmit
  }
}