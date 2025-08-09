import type { AccountInfoInterface, ProductInfoInterface } from '~/types'
import { fetchChangeStatusAPI, fetchDeleteProductAPI } from '~/apis/admin/product.api'
import { useEffect, useState } from 'react'
import { useAlertContext } from '~/contexts/admin/AlertContext'

export interface Props {
  listProducts: ProductInfoInterface[],
  listAccounts: AccountInfoInterface[],
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ listProducts, listAccounts, selectedIds, setSelectedIds }: Props) => {
  const [products, setProducts] = useState<ProductInfoInterface[]>(listProducts)
  const [accounts, setAccounts] = useState<AccountInfoInterface[]>(listAccounts)
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    setProducts(listProducts)
    setAccounts(listAccounts)
  }, [listProducts, listAccounts])

  const handleToggleStatus = async (_id: string, currentStatus: string, updatedBy: { length: number; account_id: string; updatedAt: Date }): Promise<void> => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, _id)
    if (response.code === 200) {
      setProducts((prevProducts: ProductInfoInterface[]) =>
        prevProducts.map((product) =>
          product._id === _id ? { ...product, status: newStatus, updatedBy: [...(product.updatedBy || []), updatedBy!] } : product
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
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== _id)
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
      const allIds = products.map((product) => product._id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const isCheckAll = (products.length > 0) && (selectedIds.length === products.length)

  return {
    products,
    setProducts,
    accounts,
    handleToggleStatus,
    handleDeleteProduct,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  }
}