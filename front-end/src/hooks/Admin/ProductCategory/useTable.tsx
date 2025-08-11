import type { UpdatedBy } from '~/types'
import { fetchChangeStatusAPI, fetchDeleteProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/admin/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProductCategory, dispatchProductCategory } = useProductCategoryContext()
  const { productCategories, accounts } = stateProductCategory
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()

  const handleToggleStatus = async (_id: string, currentStatus: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount!._id,
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, _id)
    if (response.code === 200) {
      dispatchProductCategory({
        type: 'SET_DATA',
        payload: {
          productCategories:  productCategories.map((productCategory) => productCategory._id === _id ? {
            ...productCategory,
            status: newStatus,
            updatedBy: [...(productCategory.updatedBy || []), currentUser]
          }: productCategory)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đã cập nhật thành công trạng thái sản phẩm!', severity: 'success' }
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  const handleDeleteProduct = async (_id: string) => {
    const isConfirm = confirm('Bạn có chắc muốn xóa sản phẩm này')
    const response = await fetchDeleteProductAPI(_id)
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
          payload: { message: 'Đã xóa thành công sản phẩm!', severity: 'success' }
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
    handleDeleteProduct,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  }
}