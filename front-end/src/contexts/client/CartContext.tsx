/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { fetchCartAPI, fetchAddProductToCartAPI } from '~/apis/client/cart.api'
import type { CartInfoInterface } from '~/types/cart.type'

interface CartContextType {
 cartDetail: CartInfoInterface | null
  // Cập nhật lại kiểu dữ liệu của hàm addToCart
 addToCart: (
    productId: string,
    quantity: number,
    color?: string | null, // Thêm color (tùy chọn)
    size?: string | null // Thêm size (tùy chọn)
  ) => Promise<void>
 refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)

  const refreshCart = async () => {
    try {
      const res = await fetchCartAPI()
      setCartDetail(res.cartDetail)
    } catch (error) {
      // Xử lý lỗi nếu người dùng chưa đăng nhập, không có giỏ hàng
      console.error('Failed to refresh cart:', error)
      setCartDetail(null)
    }
  }

  // SỬA LẠI HÀM NÀY
  const addToCart = async (
    productId: string,
    quantity: number,
    color?: string | null,
    size?: string | null
  ) => {
    // Truyền thêm color và size vào hàm gọi API
    await fetchAddProductToCartAPI(productId, quantity, color, size)
    await refreshCart() // Cập nhật lại giỏ hàng để hiển thị thay đổi
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