import type { ProductInfoInterface } from './product.type' // Giả sử bạn có file này

// Định nghĩa cho MỘT sản phẩm trong giỏ hàng
export interface CartItemInterface {
  quantity: number
  color: string
  size: string
  // Chứa thông tin đầy đủ của sản phẩm (tên, ảnh, giá, tất cả màu/size...)
  product_id: ProductInfoInterface
  // Chứa tổng tiền của dòng này (giá mới * số lượng)
  totalPrice?: number
}

// Cập nhật lại interface chính của giỏ hàng
export interface CartInfoInterface {
  _id: string // Giỏ hàng cũng có ID
  products: CartItemInterface[] // Sử dụng interface mới
  // Thêm tổng tiền của cả giỏ hàng
  totalsPrice?: number
}

// Interface này vẫn giữ nguyên, dùng để bao bọc response
export interface CartDetailInterface {
  cartDetail: CartInfoInterface
}