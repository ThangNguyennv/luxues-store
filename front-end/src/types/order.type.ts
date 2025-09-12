import type { AccountInfoInterface } from './account.type'
import type { CurrentParamsInterface, FilterStatusInterface, PaginationInterface, ParamsInterface, UpdatedBy } from './helper.type'

export interface OrderInfoInterface {
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
}

export interface OrderStates extends ParamsInterface {
  orders: OrderInfoInterface[],
  accounts: AccountInfoInterface[],
  filterOrder: FilterStatusInterface[],
  pagination: PaginationInterface,
}

export type OrderActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<OrderStates> }
  | { type: 'RESET' }