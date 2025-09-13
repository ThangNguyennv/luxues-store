import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailOrderAPI } from '~/apis/admin/order.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { OrderDetailInterface, OrderInfoInterface } from '~/types/order.type'

export const useDetail = () => {
  const [orderDetail, setOrderDetail] = useState<OrderInfoInterface | null>(null)
  const params = useParams()
  const id = params.id
  const { role } = useAuth()

  useEffect(() => {
    if (!id) return
    fetchDetailOrderAPI(id)
      .then((response: OrderDetailInterface) => {
        setOrderDetail(response.order)
      })
  }, [id])
  return {
    orderDetail,
    id,
    role
  }
}