const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");

// [GET] /cart/
module.exports.index = async (req, res) => {
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

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = productInfo.priceNew * item.quantity;
    }
  }
  cart.totalsPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  res.render("client/pages/cart/index.pug", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  const objectCart = {
    product_id: productId,
    quantity: quantity,
  };
  const cart = await Cart.findOne({
    _id: cartId,
  });
  // find() trong js (Khác find trong mongoose là tìm nhiều) -> Tìm 1 bản ghi
  const isExistProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  // Thêm sản phẩm để không bị tạo object mới
  if (isExistProductInCart) {
    const quantityNew = quantity + isExistProductInCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        $set: {
          "products.$.quantity": quantityNew,
        },
      }
    );
  } else {
    // $push: Thêm phần tử vào mảng
    await Cart.updateOne(
      { _id: cartId },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", `Đã thêm sản phẩm vào giỏ hàng!`);
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  // $pull: Loại bỏ phần tử khỏi mảng theo điều kiện
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );

  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      $set: {
        "products.$.quantity": quantity,
      },
    }
  );
  req.flash("success", "Cập nhật số lượng thành công!");
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};
