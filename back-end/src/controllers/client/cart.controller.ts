import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'

// [GET] /cart
export const index = async (req: Request, res: Response) => {
  console.log(req["cartId"])
  console.log(req.cookies.cartId)
  try {
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
      _id: cartId
    })
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id
        const productInfo = await Product.findOne({
          _id: productId
        }).select('title thumbnail slug price discountPercentage')

        productInfo['priceNew'] = productsHelper.priceNewProduct(
          productInfo as OneProduct
        )
        item['productInfo'] = productInfo
        item['totalPrice'] = productInfo['priceNew'] * item.quantity
      }
    }
    cart['totalsPrice'] = cart.products.reduce(
      (sum, item) => sum + item['totalPrice'],
      0
    )
    res.json({
      code: 200,
      message: 'Thành công!',
      cartDetail: cart
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /cart/add/:productId
export const addPost = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)
    const cartId = req["cartId"]
    const objectCart = {
      product_id: productId,
      quantity: quantity
    }
    const cart = await Cart.findOne({
      _id: cartId
    })
    // find() trong js (Khác find trong mongoose là tìm nhiều) -> Tìm 1 bản ghi
    const isExistProductInCart = cart.products.find(
      (item) => item.product_id == productId
    )

    // Thêm sản phẩm để không bị tạo object mới
    if (isExistProductInCart) {
      const quantityNew = quantity + isExistProductInCart.quantity
      await Cart.updateOne(
        {
          _id: cartId,
          'products.product_id': productId
        },
        {
          $set: {
            'products.$.quantity': quantityNew
          }
        }
      )
    } else {
      // $push: Thêm phần tử vào mảng
      await Cart.updateOne(
        { _id: cartId },
        {
          $push: { products: objectCart }
        }
      )
    }
    res.json({
      code: 200,
      message: 'Thêm thành công sản phẩm vào giỏ hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /cart/delete/:productId
export const deleteCart = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    // $pull: Loại bỏ phần tử khỏi mảng theo điều kiện
    await Cart.updateOne(
      {
        _id: cartId
      },
      {
        $pull: { products: { product_id: productId } }
      }
    )
    res.json({
      code: 200,
      message: 'Xóa thành công sản phẩm khỏi giỏ hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /cart/update/:productId/:quantity
export const update = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = req.params.quantity

    await Cart.updateOne(
      {
        _id: cartId,
        'products.product_id': productId
      },
      {
        $set: {
          'products.$.quantity': quantity
        }
      }
    )
    res.json({
      code: 200,
      message: 'Cập nhật số lượng thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
