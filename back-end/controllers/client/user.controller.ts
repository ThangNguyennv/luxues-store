import { Request, Response } from "express";
import User from "../../models/user.model";
import ForgotPassword from "../../models/forgot-password.model";
import Cart from "../../models/cart.model";
import md5 from "md5";
import * as generateHelper from "../../helpers/generate";
import * as sendMailHelper from "../../helpers/sendMail";

// [POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const isExistEmail = await User.findOne({
      email: req.body.email,
    });
    if (isExistEmail) {
      res.json({
        code: 400,
        message: "Email đã tồn tại, vui lòng chọn email khác!",
      });
      return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.json({
      code: 200,
      message: "Đăng ký tài khoản thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      deleted: false,
    });
    if (!user) {
      res.json({
        code: 400,
        message: "Email không tồn tại!",
      });
      return;
    }
    if (md5(req.body.password) !== user.password) {
      res.json({
        code: 400,
        message: "Tài khoản hoặc mật khẩu không chính xác!",
      });
      return;
    }
    if (user.status === "inactive") {
      res.json({
        code: 400,
        message: "Tài khoản đang bị khóa!",
      });
      return;
    }
    const cart = await Cart.findOne({
      user_id: user.id,
    });
    if (cart) {
      res.cookie("cartId", cart.id);
    } else {
      await Cart.updateOne(
        {
          _id: req.cookies.cartId,
        },
        {
          user_id: user.id,
        }
      );
    }
    res.cookie("tokenUser", user.tokenUser);
    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [GET] /user/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.json({
      code: 200,
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email: email,
      deleted: false,
    });
    if (!user) {
      res.json({
        code: 400,
        message: "Email không tồn tại!",
      });
      return;
    }

    // Lưu thông tin vào db
    const otp = generateHelper.generateRandomNumber(6);
    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now(),
    };
    const record = await ForgotPassword.findOne({
      email: email,
    });
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    // Tránh trường hợp gửi otp liên tục mà phải hết hạn otp đó thì mới gửi otp khác.
    if (!record) {
      res.json({
        code: 200,
        message:
          "Mã OTP đã được gửi qua email của bạn, vui lòng kiểm tra email!",
      });
      await forgotPassword.save();
    }
    // Nếu tồn tại email thì gửi mã OTP qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
    Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 2 phút.
  `;
    sendMailHelper.sendMail(email, subject, html);
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /user/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });
    if (!result) {
      res.json({
        code: 400,
        message: "OTP không hợp lệ!",
      });
      return;
    }
    const user = await User.findOne({
      email: email,
    });
    res.cookie("tokenUser", user.tokenUser);
    res.json({
      code: 200,
      message: "Mã OTP hợp lệ!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne(
      {
        tokenUser: tokenUser,
      },
      {
        password: md5(password),
      }
    );
    res.json({
      code: 400,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [GET] /user/info
export const info = async (req: Request, res: Response) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const userInfo = await User.findOne({
      tokenUser: tokenUser,
      deleted: false,
    });
    res.json({
      code: 200,
      message: "Thông tin tài khoản!",
      userInfo: userInfo,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /user/info/edit
module.exports.editPatch = async (req, res) => {
  const isEmailExist = await User.findOne({
    _id: { $ne: res.locals.user.id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
    email: req.body.email,
    deleted: false,
  });
  if (isEmailExist) {
    req.flash(
      "error",
      `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`
    );
  } else {
    await User.updateOne({ _id: res.locals.user.id }, req.body);
    req.flash("success", `Đã cập nhật thành công tài khoản!`);
  }
  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};

// // [PATCH] /user/info/edit/change-password
// module.exports.changePasswordPatch = async (req, res) => {
//   const user = await User.findOne({
//     _id: res.locals.user.id,
//     deleted: false,
//   });
//   if (user) {
//     if (md5(req.body.currentPassword) != user.password) {
//       req.flash("error", `Mật khẩu hiện tại không chính xác!`);
//       const backURL = req.get("Referrer") || "/";
//       res.redirect(backURL);
//       return;
//     }
//     if (req.body.password) {
//       req.body.password = md5(req.body.password); // Mã hóa password mới để lưu lại vào db
//     } else {
//       delete req.body.password; // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
//     }
//     await User.updateOne({ email: res.locals.user.email }, req.body);
//     req.flash("success", `Đã đổi mật khẩu thành công!`);
//   }
//   // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//   const backURL = req.get("Referrer") || "/";
//   res.redirect(backURL);
// };
