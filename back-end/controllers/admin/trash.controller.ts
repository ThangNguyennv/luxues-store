const Product = require("../../models/product.model");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");

// [GET] /admin/trash
module.exports.trash = async (req, res) => {
  // Bộ lọc
  const filterStatus = filterStatusHelpers(req.query);
  let find = {
    deleted: true,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelpers(req.query);
  if (objectSearch.regax) {
    find.title = objectSearch.regax;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 3,
    },
    req.query,
    countProducts
  );
  // End Pagination

  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/trash/index.pug", {
    pageTitle: "Thùng rác",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/trash/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // params: lưu 1 đối tượng chứa các thuộc tính như sau dấu ':' trên url như sau { status: '...' , id: '...' }
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};

// [DELETE] /admin/trash/form-change-multi-trash
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "delete-all":
      await Product.deleteMany({ _id: { $in: ids } });
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
      break;
    case "recover":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: false, recoveredAt: new Date() }
      );
      req.flash("success", `Đã khôi phục thành công ${ids.length} sản phẩm!`);
      break;
    default:
      break;
  }

  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};

// [DELETE] /admin/trash/permanently-delete/:id
module.exports.permanentlyDeleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
  await Product.deleteOne({ _id: id });
  req.flash("success", `Đã xóa thành công sản phẩm!`);

  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};

// [PATCH] /admin/trash/recover/:id
module.exports.recoverItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    { deleted: false, recoveredAt: new Date() }
  );
  req.flash("success", `Đã khôi phục thành công sản phẩm!`);

  // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
  const backURL = req.get("Referrer") || "/";
  res.redirect(backURL);
};
