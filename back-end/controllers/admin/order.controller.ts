const filterOrderHelpers = require("../../helpers/filterOrder");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const Order = require("../../models/order.model");
const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");
const systemConfig = require("../../config/system");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  const filterOrder = filterOrderHelpers(req.query);

  let find = {};

  if (req.query.status === "canceled") {
    find.deleted = true;
  } else {
    find.deleted = false;
    if (req.query.status) {
      find.status = req.query.status;
    }
  }

  const objectSearch = searchHelpers(req.query);
  if (objectSearch.regex) {
    find["products.title"] = objectSearch.regex;
  }

  // Pagination
  const countOrders = await Order.countDocuments(find);
  let objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 3,
    },
    req.query,
    countOrders
  );
  // End Pagination

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const orders = await Order.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const order of orders) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: order.createdBy.account_id,
    });
    if (user) {
      order.accountFullName = user.fullName;
    }
    // Lấy ra thông tin người cập nhật gần nhất
    const updatedBy = order.updatedBy[order.updatedBy.length - 1];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = userUpdated.fullName;
    }
    if (order.products.length > 0) {
      for (const item of order.products) {
        const productId = item.product_id;
        const productInfo = await Product.findOne({
          _id: productId,
        }).select("price discountPercentage");

        productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
        item.productInfo = productInfo;
        item.totalPrice = productInfo.priceNew * item.quantity;
      }
    }
    order.totalsPrice = order.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    order.price = order.totalsPrice;
  }
  // Sort chay do không sài hàm sort() kia cho các thuộc tính không có trong db.
  if (req.query.sortKey === "price" && req.query.sortValue) {
    const dir = req.query.sortValue === "desc" ? -1 : 1;
    orders.sort((a, b) => dir * (a.price - b.price));
  }
  res.render("admin/pages/orders/index.pug", {
    pageTitle: "Danh sách đơn hàng",
    orders: orders,
    filterOrder: filterOrder,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("orders_edit")) {
    // params: lưu 1 đối tượng chứa các thuộc tính sau dấu ':' trên url như sau { status: '...' , id: '...' }
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Order.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", "Cập nhật trạng thái thành công!");

    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  } else {
    res.send("403"); // Không có quyền truy cập
    return;
  }
};

// [PATCH] /admin/orders/change-multi
module.exports.changeMulti = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("orders_edit")) {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    switch (type) {
      case "waiting":
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: "waiting", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        );
        break;
      case "confirmed":
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: "confirmed", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        );
        break;
      case "delete-all":
        await Order.updateMany(
          { _id: { $in: ids } },
          { deleted: "true", deletedAt: new Date() }
        );
        req.flash("success", `Đã hủy thành công ${ids.length} đơn hàng!`);
        break;
      default:
        break;
    }

    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  } else {
    res.send("403"); // Không có quyền truy cập
    return;
  }
};

// [DELETE] /admin/orders/delete/:id
module.exports.deleteItem = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("orders_delete")) {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
    await Order.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );
    req.flash("success", `Đã xóa thành công đơn hàng!`);

    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  } else {
    res.send("403"); // Không có quyền truy cập
    return;
  }
};

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const findDeleted = {
      deleted: true,
      _id: req.params.id,
    };
    const order = await Order.findOne(find);
    const orderDeleted = await Order.findOne(findDeleted);

    if (order) {
      res.render("admin/pages/orders/detail.pug", {
        pageTitle: "Chi tiết đơn hàng",
        order: order,
      });
    }
    if (orderDeleted) {
      res.render("admin/pages/orders/detail.pug", {
        pageTitle: "Chi tiết đơn hàng",
        order: orderDeleted,
      });
    }
  } catch (error) {
    // Có thể không xảy ra / Ít xảy ra
    req.flash("error", `Không tồn tại đơn hàng này!`);
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};

// [PATCH] /admin/orders/recover/:id
module.exports.recoverPatch = async (req, res) => {
  const id = req.params.id;
  await Order.updateOne(
    { _id: id },
    { deleted: false, recoveredAt: new Date() }
  );
  req.flash("success", `Đã khôi phục thành công đơn hàng!`);

  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};
