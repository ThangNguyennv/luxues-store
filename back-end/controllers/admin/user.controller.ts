import { Request, Response } from "express";
import User from "../../models/user.model";
import md5 from "md5";

// [GET] /admin/users
export const index = async (req: Request, res: Response) => {
  try {
    let find = {
      deleted: false,
    };
    const records = await User.find(find).select("-password -token");
    res.json({
      code: 200,
      message: "Thành công!",
      records: records,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /admin/users/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    await User.updateOne({ _id: id }, { status: status });
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// // [GET] /admin/users/edit/:id
// module.exports.edit = async (req, res) => {
//   try {
//     const record = await User.findOne({
//       deleted: false,
//       _id: req.params.id,
//     });

//     res.render("admin/pages/users/edit.pug", {
//       pageTitle: "Chỉnh sửa người dùng",
//       record: record,
//     });
//   } catch (error) {
//     req.flash("error", `Không tồn tại người dùng này!`);
//     res.redirect(`${systemConfig.prefixAdmin}/users`);
//   }
// };

// // [PATCH] /admin/users/edit/:id
// module.exports.editPatch = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("users_edit")) {
//     try {
//       const isEmailExist = await User.findOne({
//         _id: { $ne: req.params.id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
//         email: req.body.email,
//         deleted: false,
//       });
//       if (isEmailExist) {
//         req.flash(
//           "error",
//           `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`
//         );
//       } else {
//         if (req.body.password) {
//           req.body.password = md5(req.body.password); // Mã hóa password mới để lưu lại vào db
//         } else {
//           delete req.body.password; // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
//         }
//         await User.updateOne({ _id: req.params.id }, req.body);
//         req.flash("success", `Đã cập nhật thành công người dùng!`);
//       }
//       // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//       const backURL = req.get("Referrer") || "/";
//       res.redirect(backURL);
//     } catch (error) {
//       req.flash("error", `Không thể chỉnh sửa người dùng này!`);
//       // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//       const backURL = req.get("Referrer") || "/";
//       res.redirect(backURL);
//     }
//   } else {
//     req.flash("error", `Bạn không có quyền chỉnh sửa người dùng!`);
//     // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//     const backURL = req.get("Referrer") || "/";
//     res.redirect(backURL);
//   }
// };

// // [GET] /admin/users/detail/:id
// module.exports.detail = async (req, res) => {
//   try {
//     const find = {
//       deleted: false,
//       _id: req.params.id,
//     };

//     const record = await User.findOne(find);

//     res.render("admin/pages/users/detail.pug", {
//       pageTitle: record.title,
//       record: record,
//     });
//   } catch (error) {
//     // Có thể không xảy ra / Ít xảy ra
//     req.flash("error", `Không tồn tại người dùng này!`);
//     res.redirect(`${systemConfig.prefixAdmin}/users`);
//   }
// };

// // [DELETE] /admin/users/delete/:id
// module.exports.deleteItem = async (req, res) => {
//   const permissions = res.locals.role.permissions;
//   if (permissions.includes("users_delete")) {
//     const id = req.params.id;
//     // await Role.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
//     await User.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
//     req.flash("success", `Đã xóa thành công người dùng!`);

//     // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//     const backURL = req.get("Referrer") || "/";
//     res.redirect(backURL);
//   } else {
//     req.flash("error", `Bạn không có quyền xóa người dùng!`);
//     // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//     const backURL = req.get("Referrer") || "/";
//     res.redirect(backURL);
//   }
// };
