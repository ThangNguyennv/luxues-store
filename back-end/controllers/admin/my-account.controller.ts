import { Request, Response } from "express";
import Account from "../../models/account.model";
import Role from "../../models/role.model";
import systemConfig from "../../config/system";
import md5 from "md5";

// [GET] /admin/my-account
export const index = async (req: Request, res: Response) => {
  try {
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

// [PATCH] /admin/my-account/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const isEmailExist = await Account.findOne({
      _id: { $ne: req["accountAdmin"].id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: req.body.email,
      deleted: false,
    });
    if (isEmailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`,
      });
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password); // Mã hóa password mới để lưu lại vào db
      } else {
        delete req.body.password; // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
      }
      await Account.updateOne({ _id: req["accountAdmin"].id }, req.body);
      res.json({
        code: 200,
        message: `Đã cập nhật thành công tài khoản!`,
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
