/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchOrdersAPI } from '~/apis/admin/order.api'
import { initialState, orderReducer } from '~/reducers/client/orderReducer'
import type { OrderActions, OrderAllResponseInterface, OrderStates } from '~/types/order.type'

interface OrderContextType {
  stateOrder: OrderStates
  fetchOrder: (params?: {
    status?: string
    page?: number
    keyword?: string
    sortKey?: string
    sortValue?: string
  }) => Promise<void>
  dispatchOrder: React.Dispatch<OrderActions>
}

const OrderContext = createContext<OrderContextType | null>(null)

export const OrderClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateOrder, dispatchOrder] = useReducer(orderReducer, initialState)

  const fetchOrder = useCallback(
    async ({
      status = '',
      page = 1,
      keyword = '',
      sortKey = '',
      sortValue = ''
    } = {}) => {
      dispatchOrder({ type: 'SET_LOADING', payload: true })
      try {
        const res: OrderAllResponseInterface = await fetchOrdersAPI(
          status,
          page,
          keyword,
          sortKey,
          sortValue
        )
        dispatchOrder({
          type: 'SET_DATA',
          payload: {
            orders: res.orders,
            pagination: res.pagination,
            filterOrder: res.filterOrder,
            keyword: res.keyword,
            sortKey,
            sortValue
          }
        })
      } finally {
        dispatchOrder({ type: 'SET_LOADING', payload: false })
      }
    }, [])
  return (
    <OrderContext.Provider value={{ stateOrder, fetchOrder, dispatchOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrderContext must be used inside OrderProvider')
  return context
}