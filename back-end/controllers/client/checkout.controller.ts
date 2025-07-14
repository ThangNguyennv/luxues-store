import { Request, Response } from "express";
import Cart from "../../models/cart.model";
import Product from "../../models/product.model";
import Order from "../../models/order.model";
import * as productsHelper from "../../helpers/product";
import { OneProduct } from "../../helpers/product";

// [GET] /checkout
export const index = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
      _id: cartId,
    });
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id;
        const productInfo = await Product.findOne({
          _id: productId,
        }).select("title thumbnail slug price discountPercentage");

        productInfo["priceNew"] = productsHelper.priceNewProduct(
          productInfo as OneProduct
        );
        item["productInfo"] = productInfo;
        item["totalPrice"] = productInfo["priceNew"] * item.quantity;
      }
    }
    cart["totalsPrice"] = cart.products.reduce(
      (sum, item) => sum + item["totalPrice"],
      0
    );
    res.json({
      code: 200,
      message: "Thành công!",
      cartDetail: cart,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /checkout/order
export const order = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
      _id: cartId,
    });

    const products = [];
    for (const product of cart.products) {
      const objectProduct = {
        product_id: product.product_id,
        price: 0,
        quantity: product.quantity,
        discountPercentage: 0,
      };

      const productInfo = await Product.findOne({
        _id: product.product_id,
      }).select("price discountPercentage title thumbnail");

      objectProduct.price = productInfo.price;
      objectProduct.discountPercentage = productInfo.discountPercentage;
      objectProduct["title"] = productInfo.title;
      objectProduct["thumbnail"] = productInfo.thumbnail;
      products.push(objectProduct);
    }
    const orderInfo = {
      cart_id: cartId,
      userInfo: userInfo,
      products: products,
    };

    const order = new Order(orderInfo);
    if (req.body.position == "") {
      const countOrders = await Order.countDocuments();
      req.body.position = countOrders + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    order.position = req.body.position;

    order.save();

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        products: [],
      }
    );
    res.json({
      code: 200,
      message: "Thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// // [GET] /checkout/success/:orderId
// module.exports.success = async (req, res) => {
//   const order = await Order.findOne({
//     _id: req.params.orderId,
//   });
//   for (const product of order.products) {
//     const productInfo = await Product.findOne({
//       _id: product.product_id,
//     }).select("title thumbnail");
//     product.productInfo = productInfo;
//     product.priceNew = productsHelper.priceNewProduct(product);
//     product.totalPrice = product.priceNew * product.quantity;
//   }
//   order.totalsPrice = order.products.reduce(
//     (sum, item) => sum + item.totalPrice,
//     0
//   );
//   res.render("client/pages/checkout/success.pug", {
//     pageTitle: "Đặt hàng thành công",
//     order: order,
//   });
// };
