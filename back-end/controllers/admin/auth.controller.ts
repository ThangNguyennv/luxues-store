import Account from "../../models/account.model";
import md5 from "md5";
import systemConfig from "../../config/system";
import { Request, Response } from "express";

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const accountAdmin = await Account.findOne({
      email: email,
      deleted: false,
    });
    if (!accountAdmin) {
      res.json({
        code: 400,
        message: "Email không tồn tại!",
      });
      return;
    }
    if (md5(password) != accountAdmin.password) {
      res.json({
        code: 400,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
      return;
    }
    if (accountAdmin.status == "inactive") {
      res.json({
        code: 400,
        message: "Tài khoản đã bị khóa!",
      });
      return;
    }
    // Tạo token lưu trên cookie
    res.cookie("token", accountAdmin.token);
    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      token: accountAdmin.token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  // Xóa token trong cookie
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
