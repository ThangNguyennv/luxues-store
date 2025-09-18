import type { AccountInfoInterface } from './account.type'
import type { CurrentParamsInterface, FilterStatusInterface, PaginationInterface, ParamsInterface, UpdatedBy } from './helper.type'

interface PaymentDetails {
  vnp_TxnRef?: string
  vnp_TransactionNo?: string
  vnp_BankCode?: string
  vnp_BankTranNo?: string
  vnp_CardType?: string
  vnp_OrderInfo?: string
  vnp_PayDate?: string
  vnp_ResponseCode?: string
}

export type OrderStatus = 'PENDING' | 'TRANSPORTING' | 'CONFIRMED' | 'CANCELED'

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
    status: OrderStatus,
    position: number,
    createdBy: {
      account_id: string,
    },
    updatedBy: UpdatedBy[],
    createdAt: Date | null
    updatedAt: Date | null,
    paymentInfo: {
      method: 'COD' | 'VNPAY' | 'MOMO' | 'ZALOPAY'
      status: 'PENDING' | 'PAID' | 'FAILED'
      details?: PaymentDetails
    },
    note?: string
}
export interface OrderDetailInterface {
  order: OrderInfoInterface,
  code: number,
  message: string
}

export interface OrderAllResponseInterface extends CurrentParamsInterface {
    orders: OrderInfoInterface[],
    accounts: AccountInfoInterface[],
    pagination: PaginationInterface,
    filterOrder: FilterStatusInterface[],
    allOrders: OrderInfoInterface[],
}

export interface OrderStates extends ParamsInterface {
  orders: OrderInfoInterface[],
  accounts: AccountInfoInterface[],
  filterOrder: FilterStatusInterface[],
  pagination: PaginationInterface,
  allOrders: OrderInfoInterface[],
}

export type OrderActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<OrderStates> }
  | { type: 'RESET' }