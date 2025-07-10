import { Request, Response } from "express";

import Article from "../../models/article.model";
import ArticleCategory from "../../models/article-category.model";
import Account from "../../models/account.model";

import systemConfig from "../../config/system";
import filterStatusHelpers from "../../helpers/filterStatus";
import searchHelpers from "../../helpers/search";
import paginationHelpers from "../../helpers/pagination";
import tree, { TreeNode } from "../../helpers/createTree";

// [GET] /admin/articles
export const index = async (req: Request, res: Response) => {
  // Bộ lọc
  interface Find {
    deleted: boolean;
    status?: string;
    title?: RegExp;
  }
  let find: Find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status.toString();
  }

  const objectSearch = searchHelpers(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countArticles = await Article.countDocuments(find); // Đứng trước model, ở đây là 'article' là thêm await

  let objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 3,
    },
    req.query,
    countArticles
  );
  // End Pagination

  // Sort
  interface Sort {
    position?: string;
  }
  let sort: Sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toLocaleString();
    sort[sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const articles = await Article.find(find)
    .sort(sort.toString())
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const article of articles) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: article.createdBy.account_id,
    });
    if (user) {
      article.accountFullName = user.fullName;
    }
    // Lấy ra thông tin người cập nhật gần nhất
    const updatedBy = article.updatedBy[article.updatedBy.length - 1];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }
  res.json({
    code: 200,
    message: "Thành công!",
    articles: articles,
    filterStatus: filterStatusHelpers(req.query),
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [GET] /admin/articles/create
module.exports.create = async (req, res) => {
  const category = await ArticleCategory.find({
    deleted: false,
  });
  const newCategory = createTreeHelpers.tree(category);
  res.render("admin/pages/articles/create.pug", {
    pageTitle: "Thêm mới bài viết",
    category: newCategory,
  });
};

// [POST] /admin/articles/create
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_create")) {
    if (req.body.position == "") {
      const countArticles = await Article.countDocuments();
      req.body.position = countArticles + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

    const article = new Article(req.body);
    await article.save();

    req.flash("success", `Đã thêm thành công bài viết!`);
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  } else {
    req.flash("error", `Bạn không có quyền thêm bài viết!`);
    const backURL = req.get("Referrer") || "/";
    res.redirect;
  }
};

// [GET] /admin/articles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const article = await Article.findOne(find);
    res.render("admin/pages/articles/detail.pug", {
      pageTitle: article.title,
      article: article,
    });
  } catch (error) {
    // Có thể không xảy ra / Ít xảy ra
    req.flash("error", `Không tồn tại bài viết này!`);
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  }
};

// [GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const article = await Article.findOne(find);
    const category = await ArticleCategory.find({
      deleted: false,
    });
    const newCategory = createTreeHelpers.tree(category);

    res.render("admin/pages/articles/edit.pug", {
      pageTitle: "Chỉnh sửa bài viết",
      article: article,
      category: newCategory,
    });
  } catch (error) {
    // Có thể không xảy ra / Ít xảy ra
    req.flash("error", `Không tồn tại bài viết này!`);
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  }
};

// [PATCH] /admin/articles/edit/:id
module.exports.editPatch = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_edit")) {
    req.body.position = parseInt(req.body.position);

    try {
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      };
      await Article.updateOne(
        { _id: req.params.id },
        {
          ...req.body,
          $push: {
            updatedBy: updatedBy,
          },
        }
      );
      req.flash("success", `Đã cập nhật thành công bài viết!`);

      // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
      const backURL = req.get("Referrer") || "/";
      res.redirect(backURL);
    } catch (error) {
      req.flash("error", `Không thể chỉnh sửa bài viết này!`);
      // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
      const backURL = req.get("Referrer") || "/";
      res.redirect(backURL);
    }
  } else {
    req.flash("error", `Bạn không có quyền chỉnh sửa bài viết!`);
    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  }
};

// [PATCH] /admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_edit")) {
    // params: lưu 1 đối tượng chứa các thuộc tính sau dấu ':' trên url như sau { status: '...' , id: '...' }
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Article.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", "Cập nhật trạng thái thành công!");

    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  } else {
    req.flash("error", `Bạn không có quyền thay đổi trạng thái bài viết!`);
    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  }
};

// [PATCH] /admin/articles/change-multi
module.exports.changeMulti = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_edit")) {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    switch (type) {
      case "active":
        await Article.updateMany(
          { _id: { $in: ids } },
          { status: "active", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} bài viết!`
        );
        break;
      case "inactive":
        await Article.updateMany(
          { _id: { $in: ids } },
          { status: "inactive", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} bài viết!`
        );
        break;
      case "delete-all":
        await Article.updateMany(
          { _id: { $in: ids } },
          { deleted: "true", deletedAt: new Date() }
        );
        req.flash("success", `Đã xóa thành công ${ids.length} bài viết!`);
        break;
      case "change-position":
        for (const item of ids) {
          let [id, position] = item.split("-");
          position = parseInt(position);
          await Article.updateOne(
            { _id: { $in: id } },
            { position: position, $push: { updatedBy: updatedBy } }
          );
        }
        req.flash(
          "success",
          `Đã đổi vị trí thành công ${ids.length} bài viết!`
        );
        break;
      default:
        break;
    }

    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  } else {
    req.flash("error", `Bạn không có quyền thay đổi trạng thái bài viết!`);
    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  }
};

// [DELETE] /admin/articles/delete/:id
module.exports.deleteItem = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.includes("articles_delete")) {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id }); => Xóa vĩnh viễn trong db, nếu sử dụng updateOne() -> chỉ cập nhật trong db chứ ko xóa.
    await Article.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );
    req.flash("success", `Đã xóa thành công bài viết!`);

    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  } else {
    req.flash("error", `Bạn không có quyền xóa bài viết!`);
    // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
    const backURL = req.get("Referrer") || "/";
    res.redirect(backURL);
  }
};
