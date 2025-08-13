import type { UpdatedBy } from '~/types'
import { fetchChangeStatusWithChildren, fetchDeleteProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/admin/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { updateStatusRecursively } from '~/helpers/updateStatusRecursively'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProductCategory, dispatchProductCategory } = useProductCategoryContext()
  const { productCategories, accounts } = stateProductCategory
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()

  const handleToggleStatus = async (currentStatus: string, _id: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount!._id,
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusWithChildren(newStatus, _id)
    if (response.code === 200) {
      dispatchProductCategory({
        type: 'SET_DATA',
        payload: {
          productCategories: updateStatusRecursively(productCategories, _id, newStatus, currentUser)
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
  const handleDeleteProductCategory = async (_id: string) => {
    const isConfirm = confirm('Bạn có chắc muốn xóa danh mục sản phẩm này?')
    const response = await fetchDeleteProductCategoryAPI(_id)
    if (response.code === 204) {
      if (isConfirm) {
        dispatchProductCategory({
          type: 'SET_DATA',
          payload: {
            productCategories: productCategories.filter((productCategory) => productCategory._id != _id)
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
      const allIds = productCategories.map((productCategory) => productCategory._id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }
  const isCheckAll = (productCategories.length > 0) && (selectedIds.length === productCategories.length)

  return {
    dispatchProductCategory,
    productCategories,
    accounts,
    handleToggleStatus,
    handleDeleteProductCategory,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  }
}

