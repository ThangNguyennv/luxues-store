import { fetchChangeStatusAPI, fetchDeleteProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductContext } from '~/contexts/admin/ProductContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useSearchParams } from 'react-router-dom'
import type { UpdatedBy } from '~/types/helper.type'
import { useState } from 'react'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProduct, dispatchProduct } = useProductContext()
  const { products, accounts, loading } = stateProduct
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }
  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }
  const handleDelete = async () => {
    if (!selectedId) return

    const response = await fetchDeleteProductAPI(selectedId)
    if (response.code === 204) {
      dispatchProduct({
        type: 'SET_DATA',
        payload: {
          products: products.filter((product) => product._id !== selectedId)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount!._id ?? '',
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, id)
    if (response.code === 200) {
      dispatchProduct({
        type: 'SET_DATA',
        payload: {
          products:  products.map((product) => product._id === id ? {
            ...product,
            status: newStatus,
            updatedBy: [...(product.updatedBy || []), currentUser]
          }: product)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const isConfirm = confirm('Bạn có chắc muốn xóa sản phẩm này?')
    const response = await fetchDeleteProductAPI(id)
    if (response.code === 204) {
      if (isConfirm) {
        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            products: products.filter((product) => product._id != id)
          }
        })
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
      }
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleCheckbox = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      const allIds = products.map((product) => product._id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const isCheckAll = (products.length > 0) && (selectedIds.length === products.length)

  return {
    currentStatus,
    products,
    loading,
    dispatchProduct,
    accounts,
    handleToggleStatus,
    open,
    handleOpen,
    handleClose,
    handleDelete,
    handleDeleteProduct,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    selectedId
  }
}