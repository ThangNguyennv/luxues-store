import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import Order from '~/models/order.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { vnpayBuildUrl } from '~/helpers/vnpayPayment'
import { zaloPayCreateOrder } from '~/helpers/zalopayPayment'
import "~/cron/order.cron" // ⚡ load cron khi server start
import { vnpayReturn } from '~/helpers/vnpayPayment'
import { vnpayIpn } from '~/helpers/vnpayPayment'
import { zaloPayCallback } from '~/helpers/zalopayPayment'

// [GET] /checkout
export const index = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const cart = await Cart.findOne({ _id: cartId })
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id
        const productInfo = await Product
          .findOne({ _id: productId })
          .select('title thumbnail slug price discountPercentage')

        productInfo['priceNew'] = productsHelper.priceNewProduct(
          productInfo as OneProduct
        )
        item['productInfo'] = productInfo
        item['totalPrice'] = productInfo['priceNew'] * item.quantity
      }
    }
    cart['totalsPrice'] = cart.products.reduce((sum, item) => sum + item['totalPrice'], 0)
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

// [POST] /checkout/order
export const order = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const { note, paymentMethod, fullName, phone, address } = req.body
    const userInfo = {
      fullName: fullName,
      phone: phone, 
      address: address
    }
    const cart = await Cart.findOne({ _id: cartId })
    if (cart) {
      if (cart.products.length > 0) {
        const products = []
        for (const product of cart.products) {
          const objectProduct = {
            product_id: product.product_id,
            price: 0,
            quantity: product.quantity,
            discountPercentage: 0
          }
          const productInfo = await Product
            .findOne({ _id: product.product_id })
            .select('price discountPercentage title thumbnail')
          objectProduct.price = productInfo.price
          objectProduct.discountPercentage = productInfo.discountPercentage
          objectProduct['title'] = productInfo.title
          objectProduct['thumbnail'] = productInfo.thumbnail
          products.push(objectProduct)
        }
        const totalBill = products.reduce((acc, product) => {
          const priceNewForOneProduct = (product.price * (100 - product.discountPercentage)) / 100
          return acc + priceNewForOneProduct * product.quantity
        }, 0)
        const orderInfo = {
          user_id: req["accountUser"].id,
          cart_id: cartId,
          userInfo: userInfo,
          products: products,
          userId: req['accountUser'].id,
          amount: Math.floor(totalBill),
          note: note
        }
        const order = new Order(orderInfo)
        order.paymentInfo.method = paymentMethod
        await order.save()

        if (paymentMethod === 'COD') {
          await Cart.updateOne(
            { _id: cartId },
            { products: [] }
          )
          return res.json({ 
            code: 201,  
            message: 'Thành công!', 
            order: order
          })
        } else if (paymentMethod === 'VNPAY') {
          vnpayBuildUrl(totalBill, order.id, res)
        } else if (paymentMethod === 'ZALOPAY') {
          zaloPayCreateOrder(totalBill, products, order.userInfo.phone, order.id, res)
        } else if (paymentMethod === 'MOMO') {

        }
        for (const item of products) {
          await Product.updateOne(
            { _id: item.product_id },
            { $inc: { stock: -item.quantity } } // trừ số lượng
          )
        }
      } 
    } 
  } catch (error) {
    return res.json({ 
      code: 400,  
      message: 'Lỗi!', 
      error: error
    })
  } 
}

// [GET] /checkout/success/:orderId
export const success = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId
    })
    for (const product of order.products) {
      const productInfo = await Product
        .findOne({ _id: product.product_id })
        .select('title thumbnail')
      product['productInfo'] = productInfo
      product['priceNew'] = productsHelper.priceNewProduct(
        product as OneProduct
      )
      product['totalPrice'] = product['priceNew'] * product.quantity
    }
    order['totalsPrice'] = order.products.reduce(
      (sum, item) => sum + item['totalPrice'],
      0
    )
    res.json({ 
      code: 200,  
      message: 'Đặt hàng thành công',
      order: order
    })
  } catch (error) {
    res.json({ 
      code: 400,  
      message: 'Lỗi!',
      error: error
    })
  }
}
