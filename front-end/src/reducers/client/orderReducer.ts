/* eslint-disable indent */
import type { OrderActions, OrderStates } from '~/types/order.type'

export const initialState: OrderStates = {
  filterOrder: [],
  pagination: {
    currentPage: 1,
    limitItems: 3,
    skip: 0,
    totalPage: 0
  },
  keyword: '',
  sortKey: '',
  sortValue: '',
  loading: false,
  orders: []
}

export function orderReducer(
  stateOrder: OrderStates,
  actionOrder: OrderActions
): OrderStates {
  switch (actionOrder.type) {
    case 'SET_LOADING':
      return { ...stateOrder, loading: actionOrder.payload }
    case 'SET_DATA':
      return { ...stateOrder, ...actionOrder.payload }
    case 'RESET':
      return initialState
    default:
      return stateOrder
  }
}