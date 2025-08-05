import type { ProductDetailInterface } from '~/components/Admin/Types/Interface'
import { fetchChangeStatusAPI, fetchDeleteProductAPI } from '~/apis/admin/product.api'
import { useEffect, useState } from 'react'

export interface Props {
  listProducts: ProductDetailInterface[]
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ listProducts, selectedIds, setSelectedIds }: Props) => {
  const [products, setProducts] = useState<ProductDetailInterface[]>(listProducts)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')

  useEffect(() => {
    setProducts(listProducts)
  }, [listProducts])

  const handleToggleStatus = async (_id: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, _id)
    if (response.code === 200) {
      setProducts((prevProducts: ProductDetailInterface[]) =>
        prevProducts.map((product) =>
          product._id === _id ? { ...product, status: newStatus } : product
        )
      )
      setAlertMessage('Đã cập nhật thành công trạng thái sản phẩm!')
      setAlertSeverity('success')
      setAlertOpen(true)
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
        setAlertMessage('Đã xóa thành công sản phẩm!')
        setAlertSeverity('success')
        setAlertOpen(true)
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
    alertOpen,
    setAlertOpen,
    alertMessage,
    setAlertMessage,
    alertSeverity,
    setAlertSeverity,
    handleToggleStatus,
    handleDeleteProduct,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  }
}