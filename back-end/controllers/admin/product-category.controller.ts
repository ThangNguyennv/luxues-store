import { Request, Response } from "express";

import ProductCategory from "../../models/product-category.model";
import systemConfig from "../../config/system";
import filterStatusHelpers from "../../helpers/filterStatus";
import searchHelpers from "../../helpers/search";
import { tree, TreeItem } from "../../helpers/createTree";
import { addLogInfoToTree, LogNode } from "../../helpers/addLogInfoToChildren";

// [GET] /admin/products-category
export const index = async (req: Request, res: Response) => {
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

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toLocaleString();
    sort[sortKey] = req.query.sortValue;
  } else {
    sort["position"] = "desc";
  }
  // // End Sort

  const records = await ProductCategory.find(find).sort(sort);

  const newRecords = tree(records as TreeItem[]);

  // Add log info to all nodes (parent and children)
  await addLogInfoToTree(newRecords as LogNode[]);
  res.json({
    code: 200,
    message: "Thành công!",
    records: newRecords,
    filterStatus: filterStatusHelpers(req.query),
    keyword: objectSearch.keyword,
  });
};

// [PATCH] /admin/products-category/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
      account_id: req["accountAdmin"].id,
      updatedAt: new Date(),
    };
    await ProductCategory.updateOne(
      { _id: id },
      { status: status, $push: { updatedBy: updatedBy } }
    );
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [PATCH] /admin/products-category/change-multi
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
      ACTIVE = "active",
      INACTIVE = "inactive",
      DELETEALL = "delete-all",
      CHANGEPOSITION = "change-position",
    }
    switch (type) {
      case Key.ACTIVE:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { status: Key.ACTIVE, $push: { updatedBy: updatedBy } }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`,
        });
        break;
      case Key.INACTIVE:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { status: Key.INACTIVE, $push: { updatedBy: updatedBy } }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`,
        });
        break;
      case Key.DELETEALL:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { deleted: "true", deletedAt: new Date() }
        );
        res.json({
          code: 200,
          message: `Đã xóa thành công ${ids.length} sản phẩm!`,
        });
        break;
      case Key.CHANGEPOSITION:
        for (const item of ids) {
          let [id, position] = item.split("-");
          await ProductCategory.updateOne(
            { _id: { $in: id } },
            { position: Number(position), $push: { updatedBy: updatedBy } }
          );
        }
        res.json({
          code: 200,
          message: `Đã đổi vị trí thành công ${ids.length} sản phẩm!`,
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

// // [DELETE] /admin/products-category/delete/:id
// module.exports.deleteItem = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("products-category_delete")) {
//     const id = req.params.id;

//     // await Product.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
//     await ProductCategory.updateOne(
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

// // [GET] /admin/products-category/create
// module.exports.create = async (req, res) => {
//   let find = {
//     deleted: false,
//   };

//   const records = await ProductCategory.find(find);

//   const newRecords = createTreeHelpers.tree(records);

//   res.render("admin/pages/products-category/create.pug", {
//     pageTitle: "Tạo danh mục sản phẩm",
//     records: newRecords,
//   });
// };

// // [POST] /admin/products-category/create
// module.exports.createPost = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("products-category_create")) {
//     req.body.price = parseInt(req.body.price);
//     req.body.discountPercentage = parseInt(req.body.discountPercentage);
//     req.body.stock = parseInt(req.body.stock);
//     if (req.body.position == "") {
//       const count = await ProductCategory.countDocuments();
//       req.body.position = count + 1;
//     } else {
//       req.body.position = parseInt(req.body.position);
//     }
//     req.body.createdBy = {
//       account_id: res.locals.user.id,
//     };

//     const records = new ProductCategory(req.body);
//     await records.save();

//     req.flash("success", `Đã thêm thành công sản phẩm!`);
//     res.redirect(`${systemConfig.prefixAdmin}/products-category`);
//   } else {
//     res.send("403"); // Không có quyền truy cập
//     return;
//   }
// };

// // [GET] /admin/products-category/edit/:id
// module.exports.edit = async (req, res) => {
//   try {
//     const find = {
//       deleted: false,
//       _id: req.params.id,
//     };

//     const record = await ProductCategory.findOne(find);

//     const records = await ProductCategory.find({
//       deleted: false,
//     });

//     const newRecords = createTreeHelpers.tree(records);

//     res.render("admin/pages/products-category/edit.pug", {
//       pageTitle: "Chỉnh sửa sản phẩm",
//       record: record,
//       records: newRecords,
//     });
//   } catch (error) {
//     // Có thể không xảy ra / Ít xảy ra
//     req.flash("error", `Không tồn tại sản phẩm này!`);
//     res.redirect(`${systemConfig.prefixAdmin}/products-category`);
//   }
// };

// // [PATCH] /admin/products-category/edit/:id
// module.exports.editPatch = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("products-category_edit")) {
//     req.body.position = parseInt(req.body.position);

//     try {
//       const updatedBy = {
//         account_id: res.locals.user.id,
//         updatedAt: new Date(),
//       };
//       await ProductCategory.updateOne(
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

// // [GET] /admin/products-category/detail/:id
// module.exports.detail = async (req, res) => {
//   try {
//     const find = {
//       deleted: false,
//       _id: req.params.id,
//     };

//     const record = await ProductCategory.findOne(find);
//     res.render("admin/pages/products-category/detail.pug", {
//       pageTitle: record.title,
//       record: record,
//     });
//   } catch (error) {
//     // Có thể không xảy ra / Ít xảy ra
//     req.flash("error", `Không tồn tại sản phẩm này!`);
//     res.redirect(`${systemConfig.prefixAdmin}/products-category`);
//   }
// };
