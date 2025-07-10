module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập họ tên!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  next();
};

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  next();
};

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  next();
};

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (!req.body.confirmPassword) {
    req.flash("error", `Vui lòng xác nhận nhập mật khẩu!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (req.body.password != req.body.confirmPassword) {
    req.flash("error", `Mật khẩu không khớp!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  next();
};

module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập họ tên!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  next();
};

module.exports.changePasswordPatch = (req, res, next) => {
  if (!req.body.currentPassword) {
    req.flash("error", `Vui lòng nhập mật khẩu hiện tại!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu mới!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (!req.body.confirmPassword) {
    req.flash("error", `Vui lòng xác nhận nhập mật khẩu!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  if (req.body.password != req.body.confirmPassword) {
    req.flash("error", `Mật khẩu không khớp!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
    return;
  }
  next();
};
