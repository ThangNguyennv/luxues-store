/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { fetchCartAPI, fetchAddProductToCartAPI } from '~/apis/client/cart.api'
import type { CartInfoInterface } from '~/types/cart.type'

interface CartContextType {
  cartDetail: CartInfoInterface | null
  addToCart: (productId: string, quantity: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)

  const refreshCart = async () => {
    const res = await fetchCartAPI()
    setCartDetail(res.cartDetail)
  }

  const addToCart = async (productId: string, quantity: number) => {
    await fetchAddProductToCartAPI(productId, quantity)
    await refreshCart() // cập nhật giỏ hàng realtime
  }

  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider value={{ cartDetail, addToCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart phải dùng trong CartProvider')
  return context
}
