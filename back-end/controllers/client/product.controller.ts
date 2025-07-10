const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../helpers/product");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    const getSubCategory = async (parentId) => {
      const subs = await ProductCategory.find({
        deleted: false,
        status: "active",
        parent_id: parentId,
      });
      let allSub = [...subs]; // Cú pháp trải ra (spread syntax)

      for (const sub of subs) {
        const childs = await getSubCategory(sub.id); // Gọi đệ quy để lấy tất cả các danh mục con
        allSub = allSub.concat(childs); // Nối mảng con vào mảng cha
      }
      return allSub;
    };

    const listSubCategory = await getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const products = await Product.find({
      deleted: false,
      product_category_id: { $in: [category.id, ...listSubCategoryId] },
    }).sort({ position: "desc" });

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index.pug", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại danh mục sản phẩm này!`);
    res.redirect(`/products`);
  }
};

// [GET] /products/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active",
    };

    const product = await Product.findOne(find);

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        deleted: false,
        status: "active",
      });
      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product);

    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    // Có thể không xảy ra / Ít xảy ra
    req.flash("error", `Không tồn tại sản phẩm này!`);
    res.redirect(`/products`);
  }
};
