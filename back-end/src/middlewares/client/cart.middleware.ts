import { Request, Response, NextFunction } from 'express'
import Cart from '~/models/cart.model'

export const cartId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cartId = req.cookies.cartId

  // Định nghĩa tùy chọn cookie
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const, 
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 năm
  };

  if (!cartId) {
    // Tạo giỏ hàng
    const cart = new Cart()
    await cart.save()
    res.cookie('cartId', cart.id, cookieOptions) // SỬA LỖI: Dùng cookieOptions
    req["cartId"] = cart.id,
    req['miniCart'] = cart
  } else {
    // Lấy ra
    const cart = await Cart.findById(cartId)
    if (!cart) {
      // Nếu cookie có cartId nhưng CSDL không có (ví dụ: CSDL bị xóa)
      // => Tạo giỏ hàng mới
      const newCart = new Cart()
      await newCart.save()
      res.cookie('cartId', newCart.id, cookieOptions) // SỬA LỖI: Dùng cookieOptions
      req["cartId"] = newCart.id,
      req['miniCart'] = newCart
    } else {
      // Tìm thấy giỏ hàng
      if (cart.products.length > 0) {
        cart['totalProduct'] = cart.products.length
      }
      req["cartId"] = cart.id
      req['miniCart'] = cart
    }
  }
  next()
}
