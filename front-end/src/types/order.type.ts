import type { CurrentParamsInterface, FilterStatusInterface, PaginationInterface, UpdatedBy } from './helper.type'

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
    pagination: PaginationInterface,
    filterOrder: FilterStatusInterface[],
}

