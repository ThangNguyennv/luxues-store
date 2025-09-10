export interface CartInfoInterface {
  products: [
    {
      product_id: string,
      quantity: number
    }
  ]
}

export interface CartDetailInterface {
  cartDetail: CartInfoInterface
}