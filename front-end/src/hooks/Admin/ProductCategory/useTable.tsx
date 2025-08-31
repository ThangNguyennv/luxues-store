import { fetchChangeStatusWithChildren, fetchDeleteProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { updateStatusRecursiveForProduct } from '~/helpers/updateStatusRecursiveForProduct'
import type { UpdatedBy } from '~/types/helper.type'
import { useEffect, useState } from 'react'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProductCategory, dispatchProductCategory } = useProductCategoryContext()
  const { productCategories, accounts, loading } = stateProductCategory

  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()
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

  const handleToggleStatus = async (currentStatus: string, id: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount ? myAccount._id : '',
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusWithChildren(newStatus, id)
    if (response.code === 200) {
      dispatchProductCategory({
        type: 'SET_DATA',
        payload: {
          productCategories: updateStatusRecursiveForProduct(productCategories, id, newStatus, currentUser)
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
  const handleDelete = async () => {
    if (!selectedId) return
    const response = await fetchDeleteProductCategoryAPI(selectedId)
    if (response.code === 204) {
      dispatchProductCategory({
        type: 'SET_DATA',
        payload: {
          productCategories: productCategories.filter((productCategory) => productCategory._id != selectedId)
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
  const handleCheckbox = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }
  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      const allIds = productCategories.map((productCategory) => productCategory._id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }
  const isCheckAll = (productCategories.length > 0) && (selectedIds.length === productCategories.length)

  return {
    loading,
    dispatchProductCategory,
    productCategories,
    accounts,
    handleToggleStatus,
    handleDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    open,
    handleOpen,
    handleClose
  }
}

