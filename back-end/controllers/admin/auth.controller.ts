const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login.pug", {
      pageTitle: "Trang đăng nhập",
    });
  }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  // Cách 1:
  //    const email = req.body.email;
  //    const password = req.body.password;
  // Cách 2:
  const { email, password } = req.body;

  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "Tài khoản hoặc mật khẩu không chính xác");
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  // Tạo token lưu trên cookie
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  // Xóa token trong cookie
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
