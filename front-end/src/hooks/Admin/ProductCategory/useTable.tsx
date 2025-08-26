import { fetchChangeStatusWithChildren, fetchDeleteProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { updateStatusRecursiveForProduct } from '~/helpers/updateStatusRecursiveForProduct'
import type { UpdatedBy } from '~/types/helper.type'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProductCategory, dispatchProductCategory } = useProductCategoryContext()
  const { productCategories, accounts } = stateProductCategory
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()

  const handleToggleStatus = async (currentStatus: string, id: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount!._id ?? '',
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
  const handleDeleteProductCategory = async (id: string) => {
    const isConfirm = confirm('Bạn có chắc muốn xóa danh mục sản phẩm này?')
    const response = await fetchDeleteProductCategoryAPI(id)
    if (response.code === 204) {
      if (isConfirm) {
        dispatchProductCategory({
          type: 'SET_DATA',
          payload: {
            productCategories: productCategories.filter((productCategory) => productCategory._id != id)
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

