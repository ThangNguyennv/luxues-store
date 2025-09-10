import { Request, Response, NextFunction } from 'express'
import Cart from '~/models/cart.model'

export const cartId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cartId = req.cookies.cartId
  if (!cartId) {
    // Tạo giỏ hàng
    const cart = new Cart()
    await cart.save()

    const expiresCookie = 365 * 24 * 60 * 60 * 1000 // Thời hạn 1 năm
    res.cookie('cartId', cart._id, {
      expires: new Date(Date.now() + expiresCookie),
    })
    req['miniCart'] = cart
  } else {
    // Lấy ra
    const cart = await Cart.findById(cartId)
    if (cart.products.length > 0) {
      cart['totalProduct'] = cart.products.length
    }
    req['miniCart'] = cart
  }
  next()
}
