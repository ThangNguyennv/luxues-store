import type { AccountInfoInterface, ProductCategoryInfoInterface } from '~/types'
import { fetchChangeStatusAPI, fetchDeleteProductAPI } from '~/apis/admin/product.api'
import { useEffect, useState } from 'react'
import { useAlertContext } from '~/contexts/admin/AlertContext'

export interface Props {
  listProductCategories: ProductCategoryInfoInterface[] | [],
  listAccounts: AccountInfoInterface[],
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ listProductCategories, listAccounts, selectedIds, setSelectedIds }: Props) => {
  const [productCategories, setProductCategories] = useState<ProductCategoryInfoInterface[]>(listProductCategories)
  const [accounts, setAccounts] = useState<AccountInfoInterface[]>(listAccounts)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    setProductCategories(listProductCategories)
    setAccounts(listAccounts)
  }, [listProductCategories, listAccounts])

  const handleToggleStatus = async (_id: string, currentStatus: string, updatedBy: { length: number; account_id: string; updatedAt: Date }): Promise<void> => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, _id)
    if (response.code === 200) {
      setProductCategories((prevProductCategories: ProductCategoryInfoInterface[]) =>
        prevProductCategories.map((productCategory) =>
          productCategory._id === _id ? { ...productCategory, status: newStatus, updatedBy: [...(productCategory.updatedBy || []), updatedBy!] } : productCategory
        )
      )
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
        setProductCategories((prevProductCategories) =>
          prevProductCategories.filter((productCategory) => productCategory._id !== _id)
        )
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
    productCategories,
    accounts,
    setProductCategories,
    handleToggleStatus,
    handleDeleteProduct,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  }
}