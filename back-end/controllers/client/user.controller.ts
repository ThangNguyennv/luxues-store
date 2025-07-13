import { Request, Response } from "express";
import User from "../../models/user.model";
import ForgotPassword from "../../models/forgot-password.model";
import Cart from "../../models/cart.model";
import md5 from "md5";
import generateHelper from "../../helpers/generate";
import sendMailHelper from "../../helpers/sendMail";

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

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (md5(req.body.password) !== user.password) {
    req.flash("error", "Tài khoản hoặc mật khẩu không chính xác!");
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đang bị khóa!");
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
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
  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password.pug", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
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
  // Tránh trường hợp gửi otp liên tục
  if (!record) {
    req.flash(
      "success",
      "Mã OTP đã được gửi qua email của bạn, vui lòng kiểm tra email!"
    );
    await forgotPassword.save();
  }
  // Nếu tồn tại email thì gửi mã OTP qua email (viết sau)
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 2 phút.
  `;
  sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Nhập mã otp",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "OTP không hợp lệ!");
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);
  res.redirect(`/user/password/reset`);
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
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
  req.flash("success", "Đổi mật khẩu thành công!");
  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
  });
};

// [GET] /user/info/edit
module.exports.edit = async (req, res) => {
  res.render("client/pages/user/edit.pug", {
    pageTitle: "Chỉnh sửa thông tin tài khoản",
  });
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

// [GET] /user/info/edit/change-password
module.exports.changePassword = async (req, res) => {
  res.render("client/pages/user/change-password.pug", {
    pageTitle: "Thay đổi mật khẩu tài khoản",
  });
};

// [PATCH] /user/info/edit/change-password
module.exports.changePasswordPatch = async (req, res) => {
  const user = await User.findOne({
    _id: res.locals.user.id,
    deleted: false,
  });
  if (user) {
    if (md5(req.body.currentPassword) != user.password) {
      req.flash("error", `Mật khẩu hiện tại không chính xác!`);
      const backURL = req.get("Referrer") || "/";
      res.redirect(backURL);
      return;
    }
    if (req.body.password) {
      req.body.password = md5(req.body.password); // Mã hóa password mới để lưu lại vào db
    } else {
      delete req.body.password; // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
    }
    await User.updateOne({ email: res.locals.user.email }, req.body);
    req.flash("success", `Đã đổi mật khẩu thành công!`);
  }
  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};
