const SettingsGeneral = require("../../models/settings-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  // {} => Luôn luôn lấy ra phần tử đầu tiên
  const settingsGeneral = await SettingsGeneral.findOne({});
  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    settingsGeneral: settingsGeneral,
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingsGeneral = await SettingsGeneral.findOne({});
  if (settingsGeneral) {
    await SettingsGeneral.updateOne({ _id: settingsGeneral.id }, req.body);
  } else {
    const record = new SettingsGeneral(req.body);
    await record.save();
  }
  req.flash("success", "Cập nhật cài đặt chung thành công!");
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};
