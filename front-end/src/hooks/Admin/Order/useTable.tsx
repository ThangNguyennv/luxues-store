import { fetchChangeStatusAPI } from '~/apis/admin/order.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductContext } from '~/contexts/admin/ProductContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useSearchParams } from 'react-router-dom'
import type { UpdatedBy } from '~/types/helper.type'
import { useEffect, useState } from 'react'
import type { OrderAllResponseInterface, OrderInfoInterface } from '~/types/order.type'
import { fetchOrdersAPI } from '~/apis/admin/order.api'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
  const { dispatchAlert } = useAlertContext()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderInfoInterface[]>([])
  const { myAccount } = useAuth()


  useEffect(() => {
    fetchOrdersAPI(status).then((res: OrderAllResponseInterface) => {
      setOrders(res.orders)
    })
  }, [])

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }

  // const handleDelete = async () => {
  //   if (!selectedId) return

  //   const response = await fetchDeleteProductAPI(selectedId)
  //   if (response.code === 204) {
  //     dispatchProduct({
  //       type: 'SET_DATA',
  //       payload: {
  //         products: products.filter((product) => product._id !== selectedId)
  //       }
  //     })
  //     dispatchAlert({
  //       type: 'SHOW_ALERT',
  //       payload: { message: response.message, severity: 'success' }
  //     })
  //     setOpen(false)
  //   } else if (response.code === 400) {
  //     alert('error: ' + response.error)
  //     return
  //   }
  // }

  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount ? myAccount._id : '',
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'waiting' ? 'confirmed' : 'waiting'
    const response = await fetchChangeStatusAPI(newStatus, id)
    if (response.code === 200) {
      setOrders( orders.map((order) => order._id === id ? {
        ...order,
        status: newStatus,
        updatedBy: [...(order.updatedBy || []), currentUser]
      }: order) )
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  // const handleCheckbox = (id: string, checked: boolean) => {
  //   if (checked) {
  //     setSelectedIds((prev) => [...prev, id])
  //   } else {
  //     setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
  //   }
  // }

  // const handleCheckAll = (checked: boolean) => {
  //   if (checked) {
  //     const allIds = products.map((product) => product._id)
  //     setSelectedIds(allIds)
  //   } else {
  //     setSelectedIds([])
  //   }
  // }

  // const isCheckAll = (products.length > 0) && (selectedIds.length === products.length)

  return {
    orders,
    handleToggleStatus
  }
}