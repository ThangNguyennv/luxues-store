import { Request, Response } from "express";
import filterOrderHelpers from "../../helpers/filterOrder";
import searchHelpers from "../../helpers/search";
import paginationHelpers from "../../helpers/pagination";
import Order from "../../models/order.model";
import Account from "../../models/account.model";
import Product from "../../models/product.model";
import * as productsHelper from "../../helpers/product";
import systemConfig from "../../config/system";
import { OneProduct } from "../../helpers/product";

// [GET] /admin/orders
export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean;
      status?: string;
      title?: RegExp;
    }
    let find: Find = {
      deleted: false,
    };

    if (req.query.status === "canceled") {
      find.deleted = true;
    } else {
      find.deleted = false;
      if (req.query.status) {
        find.status = req.query.status.toString();
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
      const sortKey = req.query.sortKey.toLocaleString();
      sort[sortKey] = req.query.sortValue;
    } else {
      sort["position"] = "desc";
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
        order["accountFullName"] = user.fullName;
      }
      // Lấy ra thông tin người cập nhật gần nhất
      const updatedBy = order.updatedBy[order.updatedBy.length - 1];
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });
        updatedBy["accountFullName"] = userUpdated.fullName;
      }
      if (order.products.length > 0) {
        for (const item of order.products) {
          const productId = item.product_id;
          const productInfo: OneProduct = await Product.findOne({
            _id: productId,
          }).select("price discountPercentage");
          productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
          item["productInfo"] = productInfo;
          item["totalPrice"] = productInfo.priceNew * item.quantity;
        }
      }
      order["totalsPrice"] = order.products.reduce(
        (sum, item) => sum + item["totalPrice"],
        0
      );
      order["price"] = order["totalsPrice"];
    }
    // Sort chay do không sài hàm sort() kia cho các thuộc tính không có trong db.
    if (req.query.sortKey === "price" && req.query.sortValue) {
      const dir = req.query.sortValue === "desc" ? -1 : 1;
      orders.sort((a, b) => dir * (a["price"] - b["price"]));
    }
    res.json({
      code: 200,
      message: "Thành công!",
      orders: orders,
      filterOrder: filterOrderHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /admin/orders/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
      account_id: req["accountAdmin"].id,
      updatedAt: new Date(),
    };
    await Order.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      }
    );
    res.json({
      code: 400,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /admin/orders/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] };
    const type = body.type;
    const ids = body.ids;
    const updatedBy = {
      account_id: req["accountAdmin"].id,
      updatedAt: new Date(),
    };
    enum Key {
      WAITING = "waiting",
      CONFIRMED = "confirmed",
      DELETEALL = "delete-all",
    }
    switch (type) {
      case Key.WAITING:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.WAITING, $push: { updatedBy: updatedBy } }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`,
        });
        break;
      case Key.CONFIRMED:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.CONFIRMED, $push: { updatedBy: updatedBy } }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`,
        });
        break;
      case Key.DELETEALL:
        await Order.updateMany(
          { _id: { $in: ids } },
          { deleted: "true", deletedAt: new Date() }
        );
        res.json({
          code: 200,
          message: `Đã hủy thành công ${ids.length} đơn hàng!`,
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// // [DELETE] /admin/orders/delete/:id
// module.exports.deleteItem = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("orders_delete")) {
//     const id = req.params.id;
//     // await Product.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
//     await Order.updateOne(
//       { _id: id },
//       {
//         deleted: true,
//         deletedBy: {
//           account_id: res.locals.user.id,
//           deletedAt: new Date(),
//         },
//       }
//     );
//     req.flash("success", `Đã xóa thành công đơn hàng!`);

//     // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//     const backURL = req.get("Referrer") || "/";
//     res.redirect(backURL);
//   } else {
//     res.send("403"); // Không có quyền truy cập
//     return;
//   }
// };

// // [GET] /admin/orders/detail/:id
// module.exports.detail = async (req, res) => {
//   try {
//     const find = {
//       deleted: false,
//       _id: req.params.id,
//     };
//     const findDeleted = {
//       deleted: true,
//       _id: req.params.id,
//     };
//     const order = await Order.findOne(find);
//     const orderDeleted = await Order.findOne(findDeleted);

//     if (order) {
//       res.render("admin/pages/orders/detail.pug", {
//         pageTitle: "Chi tiết đơn hàng",
//         order: order,
//       });
//     }
//     if (orderDeleted) {
//       res.render("admin/pages/orders/detail.pug", {
//         pageTitle: "Chi tiết đơn hàng",
//         order: orderDeleted,
//       });
//     }
//   } catch (error) {
//     // Có thể không xảy ra / Ít xảy ra
//     req.flash("error", `Không tồn tại đơn hàng này!`);
//     res.redirect(`${systemConfig.prefixAdmin}/orders`);
//   }
// };

// // [PATCH] /admin/orders/recover/:id
// module.exports.recoverPatch = async (req, res) => {
//   const id = req.params.id;
//   await Order.updateOne(
//     { _id: id },
//     { deleted: false, recoveredAt: new Date() }
//   );
//   req.flash("success", `Đã khôi phục thành công đơn hàng!`);

//   // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//   const backURL = req.get("Referrer") || "/";
//   res.redirect(backURL);
// };
