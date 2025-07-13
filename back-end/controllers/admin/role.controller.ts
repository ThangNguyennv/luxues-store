import { Request, Response } from "express";

import Role from "../../models/role.model";
import Account from "../../models/account.model";

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  try {
    let find = {
      deleted: false,
    };

    const records = await Role.find(find);
    for (const record of records) {
      // Lấy ra thông tin người cập nhật
      const updatedBy = record.updatedBy[record.updatedBy.length - 1]; // Lấy phần tử cuối của mảng updatedBy
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
      records: records,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const record = new Role(req.body);
    await record.save();
    res.json({
      code: 200,
      message: "Tạo thành công nhóm quyền!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const updatedBy = {
      account_id: req["accountAdmin"].id,
      updatedAt: new Date(),
    };
    await Role.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );
    res.json({
      code: 200,
      message: `Đã cập nhật thành công sản phẩm!`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// // [DELETE] /admin/roles/delete/:id
// module.exports.deleteItem = async (req, res) => {
//   const id = req.params.id;
//   // await Role.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
//   await Role.updateOne(
//     { _id: id },
//     {
//       deleted: true,
//       deletedBy: {
//         account_id: res.locals.user.id,
//         deletedAt: new Date(),
//       },
//     }
//   );
//   req.flash("success", `Đã xóa thành công sản phẩm!`);

//   // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//   const backURL = req.get("Referrer") || "/";
//   res.redirect(backURL);
// };

// // [GET] /admin/roles/detail/:id
// module.exports.detail = async (req, res) => {
//   try {
//     const find = {
//       deleted: false,
//       _id: req.params.id,
//     };

//     const record = await Role.findOne(find);
//     res.render("admin/pages/roles/detail.pug", {
//       pageTitle: record.title,
//       record: record,
//     });
//   } catch (error) {
//     // Có thể không xảy ra / Ít xảy ra
//     req.flash("error", `Không tồn tại sản phẩm này!`);
//     res.redirect(`${systemConfig.prefixAdmin}/roles`);
//   }
// };

// // [GET] /admin/roles/permissions
// module.exports.permissions = async (req, res) => {
//   let find = {
//     deleted: false,
//   };
//   const records = await Role.find(find);
//   res.render("admin/pages/roles/permissions.pug", {
//     pageTitle: "Phân quyền",
//     records: records,
//   });
// };

// // [PATCH] /admin/roles/permissions
// module.exports.permissionsPatch = async (req, res) => {
//   try {
//     const permissions = JSON.parse(req.body.permissions);
//     for (const item of permissions) {
//       await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
//     }
//     req.flash("success", `Cập nhật phân quyền thành công`);
//     const backURL = req.get("Referrer") || "/";
//     res.redirect(backURL);
//   } catch (error) {
//     req.flash("error", `Không tồn tại sản phẩm này!`);
//   }
// };
