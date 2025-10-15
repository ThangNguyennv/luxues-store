import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { version } from 'mongoose'

// [GET] /cart
export const index = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
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
        // Thêm color và size vào item để frontend dễ dàng truy cập
        // item['color'] = item.color
        // item['size'] = item.size
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
  console.log(req.body)
  try {
    const productId = req.params.productId
    const { quantity, color, size } = req.body 
    const cartId = req["cartId"]
    // Thử cập nhật số lượng của sản phẩm nếu nó đã tồn tại với ĐÚNG color và size
    const result = await Cart.updateOne(
      {
        _id: cartId,
        'products.product_id': productId,
        'products.color': color, // Phải khớp cả color
        'products.size': size    // và cả size
      },
      {
        // Dùng $inc để tăng số lượng một cách an toàn
        $inc: { 'products.$.quantity': quantity } 
      }
    )
    // Nếu không có dòng nào được cập nhật (modifiedCount = 0), có nghĩa là đây là một biến thể mới
    console.log("🚀 ~ cart.controller.ts ~ addPost ~ result.modifiedCount:", result.modifiedCount);
    if (result.modifiedCount === 0) {
      const productInfo = {
        product_id: productId,
        quantity: quantity,
        color: color,
        size: size
      }
      
      // Thêm sản phẩm mới vào giỏ hàng
      await Cart.updateOne(
        { _id: cartId },
        { $push: { products: productInfo } }
      )
    }

    res.json({
      code: 201,
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
      code: 204,
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

// [PATCH] /cart/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies.cartId
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids
    enum Key {
      DELETEALL = 'delete-all',
      CHANGEQUANTITY = 'change-quantity',
    }
    switch (type) {
      case Key.DELETEALL:
        let arrayId = []
        for (const item of ids) {
          const [id] = item.split('-')
          arrayId.push(id)
        }
        await Cart.updateOne(
          {
            _id: cartId,
          },
          {
            $pull: { products: { product_id: { $in: arrayId } } }
          }
        )
        res.json({
          code: 204,
          message: `Xóa thành công ${ids.length} sản phẩm!`
        })
        break
      case Key.CHANGEQUANTITY:
        for (const item of ids) {
          const [id, quantity] = item.split('-')
          await Cart.updateOne(
            { _id: cartId,
              'products.product_id': id
            },
            {
              $set: {
                'products.$.quantity': quantity
              }
            }
          )
        }
        res.json({
          code: 200,
          message: `Cập nhật thành công số lượng ${ids.length} sản phẩm!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại sản phẩm!'
        })
        break
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}