export interface OrderInfoInterface {
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
}

export interface OrderDetailInterface {
    order: OrderInfoInterface
}