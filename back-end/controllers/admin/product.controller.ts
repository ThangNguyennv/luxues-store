import { Request, Response } from "express";
import Product from "../../models/product.model";
import ProductCategory from "../../models/product-category.model";
import Account from "../../models/account.model";

import filterStatusHelpers from "../../helpers/filterStatus";
import searchHelpers from "../../helpers/search";
import paginationHelpers from "../../helpers/pagination";

// [GET] /admin/products
export const product = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean;
      status?: string;
      title?: RegExp;
    }
    let find: Find = {
      deleted: false,
    };

    if (req.query.status) {
      find.status = req.query.status.toString();
    }

    const objectSearch = searchHelpers(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelpers(
      {
        currentPage: 1,
        limitItems: 3,
      },
      req.query,
      countProducts
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

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);
    // products trả về 1 mảng các object => Duyệt for of bình thường
    for (const product of products) {
      // Lấy ra thông tin người tạo
      const user = await Account.findOne({
        _id: product.createdBy.account_id,
      });
      if (user) {
        product["accountFullName"] = user.fullName;
      }
      // Lấy ra thông tin người cập nhật gần nhất
      const updatedBy = product.updatedBy[product.updatedBy.length - 1];
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });
        updatedBy["accountFullName"] = userUpdated.fullName;
      }
    }
    res.json({
      code: 200,
      message: "Thành công!",
      products: products,
      filterStatus: filterStatusHelpers(req.query),
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

// // [PATCH] /admin/products/change-status/:status/:id
// module.exports.changeStatus = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("products_edit")) {
//     // params: lưu 1 đối tượng chứa các thuộc tính sau dấu ':' trên url như sau { status: '...' , id: '...' }
//     const status = req.params.status;
//     const id = req.params.id;

//     const updatedBy = {
//       account_id: res.locals.user.id,
//       updatedAt: new Date(),
//     };
//     await Product.updateOne(
//       { _id: id },
//       {
//         status: status,
//         $push: { updatedBy: updatedBy },
//       }
//     );

//     req.flash("success", "Cập nhật trạng thái thành công!");

//     // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//     const backURL = req.get("Referrer") || "/";
//     res.redirect(backURL);
//   } else {
//     res.send("403"); // Không có quyền truy cập
//     return;
//   }
// };

// // [PATCH] /admin/products/change-multi
// module.exports.changeMulti = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("products_edit")) {
//     const type = req.body.type;
//     const ids = req.body.ids.split(", ");
//     const updatedBy = {
//       account_id: res.locals.user.id,
//       updatedAt: new Date(),
//     };
//     switch (type) {
//       case "active":
//         await Product.updateMany(
//           { _id: { $in: ids } },
//           { status: "active", $push: { updatedBy: updatedBy } }
//         );
//         req.flash(
//           "success",
//           `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
//         );
//         break;
//       case "inactive":
//         await Product.updateMany(
//           { _id: { $in: ids } },
//           { status: "inactive", $push: { updatedBy: updatedBy } }
//         );
//         req.flash(
//           "success",
//           `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
//         );
//         break;
//       case "delete-all":
//         await Product.updateMany(
//           { _id: { $in: ids } },
//           { deleted: "true", deletedAt: new Date() }
//         );
//         req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
//         break;
//       case "change-position":
//         for (const item of ids) {
//           let [id, position] = item.split("-");
//           position = parseInt(position);
//           await Product.updateOne(
//             { _id: { $in: id } },
//             { position: position, $push: { updatedBy: updatedBy } }
//           );
//         }
//         req.flash(
//           "success",
//           `Đã đổi vị trí thành công ${ids.length} sản phẩm!`
//         );
//         break;
//       default:
//         break;
//     }

//     // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//     const backURL = req.get("Referrer") || "/";
//     res.redirect(backURL);
//   } else {
//     res.send("403"); // Không có quyền truy cập
//     return;
//   }
// };

// // [DELETE] /admin/products/delete/:id
// module.exports.deleteItem = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("products_delete")) {
//     const id = req.params.id;
//     // await Product.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
//     await Product.updateOne(
//       { _id: id },
//       {
//         deleted: true,
//         deletedBy: {
//           account_id: res.locals.user.id,
//           deletedAt: new Date(),
//         },
//       }
//     );
//     req.flash("success", `Đã xóa thành công sản phẩm!`);

//     // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//     const backURL = req.get("Referrer") || "/";
//     res.redirect(backURL);
//   } else {
//     res.send("403"); // Không có quyền truy cập
//     return;
//   }
// };

// // [GET] /admin/products/create
// module.exports.create = async (req, res) => {
//   const category = await ProductCategory.find({
//     deleted: false,
//   });
//   const newCategory = createTreeHelpers.tree(category);
//   res.render("admin/pages/products/create.pug", {
//     pageTitle: "Thêm mới sản phẩm",
//     category: newCategory,
//   });
// };

// // [POST] /admin/products/create
// module.exports.createPost = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("products_create")) {
//     req.body.price = parseInt(req.body.price);
//     req.body.discountPercentage = parseInt(req.body.discountPercentage);
//     req.body.stock = parseInt(req.body.stock);

//     if (req.body.position == "") {
//       const countProducts = await Product.countDocuments();
//       req.body.position = countProducts + 1;
//     } else {
//       req.body.position = parseInt(req.body.position);
//     }
//     req.body.createdBy = {
//       account_id: res.locals.user.id,
//     };

//     // Bỏ lưu trên local
//     // if (req.file) {
//     //   req.body.thumbnail = `/uploads/${req.file.filename}`;
//     // }

//     const product = new Product(req.body);
//     await product.save();

//     req.flash("success", `Đã thêm thành công sản phẩm!`);
//     res.redirect(`${systemConfig.prefixAdmin}/products`);
//   } else {
//     res.send("403"); // Không có quyền truy cập
//     return;
//   }
// };

// // [GET] /admin/products/edit/:id
// module.exports.edit = async (req, res) => {
//   try {
//     const find = {
//       deleted: false,
//       _id: req.params.id,
//     };
//     const product = await Product.findOne(find);
//     const category = await ProductCategory.find({
//       deleted: false,
//     });
//     const newCategory = createTreeHelpers.tree(category);

//     res.render("admin/pages/products/edit.pug", {
//       pageTitle: "Chỉnh sửa sản phẩm",
//       product: product,
//       category: newCategory,
//     });
//   } catch (error) {
//     // Có thể không xảy ra / Ít xảy ra
//     req.flash("error", `Không tồn tại sản phẩm này!`);
//     res.redirect(`${systemConfig.prefixAdmin}/products`);
//   }
// };

// // [PATCH] /admin/products/edit/:id
// module.exports.editPatch = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("products_edit")) {
//     req.body.price = parseInt(req.body.price);
//     req.body.discountPercentage = parseInt(req.body.discountPercentage);
//     req.body.stock = parseInt(req.body.stock);
//     req.body.position = parseInt(req.body.position);

//     // Bỏ local
//     // if (req.file) {
//     //   req.body.thumbnail = `/uploads/${req.file.filename}`;
//     // }
//     try {
//       const updatedBy = {
//         account_id: res.locals.user.id,
//         updatedAt: new Date(),
//       };
//       await Product.updateOne(
//         { _id: req.params.id },
//         {
//           ...req.body,
//           $push: {
//             updatedBy: updatedBy,
//           },
//         }
//       );
//       req.flash("success", `Đã cập nhật thành công sản phẩm!`);

//       // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//       const backURL = req.get("Referrer") || "/";
//       res.redirect(backURL);
//     } catch (error) {
//       req.flash("error", `Không thể chỉnh sửa sản phẩm này!`);
//       // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//       const backURL = req.get("Referrer") || "/";
//       res.redirect(backURL);
//     }
//   } else {
//     res.send("403"); // Không có quyền truy cập
//     return;
//   }
// };

// // [GET] /admin/products/detail/:id
// module.exports.detail = async (req, res) => {
//   try {
//     const find = {
//       deleted: false,
//       _id: req.params.id,
//     };

//     const product = await Product.findOne(find);
//     res.render("admin/pages/products/detail.pug", {
//       pageTitle: product.title,
//       product: product,
//     });
//   } catch (error) {
//     // Có thể không xảy ra / Ít xảy ra
//     req.flash("error", `Không tồn tại sản phẩm này!`);
//     res.redirect(`${systemConfig.prefixAdmin}/products`);
//   }
// };
