const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
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
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }
  res.render("admin/pages/roles/index.pug", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create.pug", {
    pageTitle: "Thêm mới nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await Role.findOne(find);
    res.render("admin/pages/roles/edit.pug", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      record: record,
    });
  } catch (error) {
    // Có thể không xảy ra / Ít xảy ra
    req.flash("error", `Không tồn tại sản phẩm này!`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
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
    req.flash("success", `Đã cập nhật thành công sản phẩm!`);
    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  } catch (error) {
    req.flash("error", `Không thể chỉnh sửa sản phẩm này!`);
    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  }
};

// [DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Role.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Đã xóa thành công sản phẩm!`);

  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await Role.findOne(find);
    res.render("admin/pages/roles/detail.pug", {
      pageTitle: record.title,
      record: record,
    });
  } catch (error) {
    // Có thể không xảy ra / Ít xảy ra
    req.flash("error", `Không tồn tại sản phẩm này!`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions.pug", {
    pageTitle: "Phân quyền",
    records: records,
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", `Cập nhật phân quyền thành công`);
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  } catch (error) {
    req.flash("error", `Không tồn tại sản phẩm này!`);
  }
};
