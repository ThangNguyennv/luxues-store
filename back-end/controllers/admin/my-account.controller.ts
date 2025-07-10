const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index.pug", {
    pageTitle: "Trang thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const isEmailExist = await Account.findOne({
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
    if (req.body.password) {
      req.body.password = md5(req.body.password); // Mã hóa password mới để lưu lại vào db
    } else {
      delete req.body.password; // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
    }
    await Account.updateOne({ _id: res.locals.user.id }, req.body);
    req.flash("success", `Đã cập nhật thành công tài khoản!`);
  }
  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};
