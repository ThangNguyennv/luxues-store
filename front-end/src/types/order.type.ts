import type { AccountInfoInterface } from './account.type'
import type { CurrentParamsInterface, FilterStatusInterface, PaginationInterface, ParamsInterface, UpdatedBy } from './helper.type'

export interface OrderInfoInterface {
    deleted?: boolean,
    _id: string,
    cartId: string,
    userInfo: {
      fullName: string,
      phone: string,
      address: string
    },
    products: {
      title: string,
      price: number,
      discountPercentage: number,
      quantity: number,
      thumbnail: string
    }[]
    status: string,
    position: number,
    createdBy: {
      account_id: string,
    },
    updatedBy: UpdatedBy[],
    createdAt: Date | null
    updatedAt: Date | null
}

export interface OrderDetailInterface {
    order: OrderInfoInterface
}

export interface OrderAllResponseInterface extends CurrentParamsInterface {
    orders: OrderInfoInterface[],
    accounts: AccountInfoInterface[],
    pagination: PaginationInterface,
    filterOrder: FilterStatusInterface[],
    allOrders: OrderInfoInterface[]
}

export interface OrderStates extends ParamsInterface {
  orders: OrderInfoInterface[],
  accounts: AccountInfoInterface[],
  filterOrder: FilterStatusInterface[],
  pagination: PaginationInterface,
  allOrders: OrderInfoInterface[]
}

export type OrderActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<OrderStates> }
  | { type: 'RESET' }