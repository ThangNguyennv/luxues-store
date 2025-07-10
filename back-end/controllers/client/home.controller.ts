const Product = require("../../models/product.model");
const Article = require("../../models/article.model");
const productsHelper = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

  // Lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);

  // Lấy ra bài viết nổi bật
  const articlesFeatured = await Article.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);

  // Lấy ra bài viết mới nhất
  const articlesNew = await Article.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
    articlesFeatured: articlesFeatured,
    articlesNew: articlesNew,
  });
};
