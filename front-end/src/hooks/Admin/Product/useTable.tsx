import type { UpdatedBy } from '~/types'
import { fetchChangeStatusAPI, fetchDeleteProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/admin/AlertContext'
import { useProductContext } from '~/contexts/admin/ProductContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useSearchParams } from 'react-router-dom'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProduct, dispatchProduct } = useProductContext()
  const { products, accounts } = stateProduct
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''

  const handleToggleStatus = async (_id: string, currentStatus: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount!._id,
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, _id)
    if (response.code === 200) {
      dispatchProduct({
        type: 'SET_DATA',
        payload: {
          products:  products.map((product) => product._id === _id ? {
            ...product,
            status: newStatus,
            updatedBy: [...(product.updatedBy || []), currentUser]
          }: product)
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
        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            products: products.filter((product) => product._id != _id)
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
      const allIds = products.map((product) => product._id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }
  // const filteredProducts = products.filter(product => {
  //   if (!currentStatus) return true // nút "Tất cả"
  //   return product.status === currentStatus
  // })

  const isCheckAll = (products.length > 0) && (selectedIds.length === products.length)

  return {
    // filteredProducts,
    currentStatus,
    products,
    dispatchProduct,
    accounts,
    handleToggleStatus,
    handleDeleteProduct,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  }
}