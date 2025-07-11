import { Request, Response } from "express";

import ArticleCategory from "../../models/article-category.model";
import filterStatusHelpers from "../../helpers/filterStatus";
import searchHelpers from "../../helpers/search";
import { tree, TreeItem } from "../../helpers/createTree";
import { addLogInfoToTree, LogNode } from "../../helpers/addLogInfoToChildren";

// [GET] /admin/articles-category
export const index = async (req: Request, res: Response) => {
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

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toLocaleString();
    sort[sortKey] = req.query.sortValue;
  } else {
    sort["position"] = "desc";
  }
  // // End Sort

  const records = await ArticleCategory.find(find).sort(sort);

  // Tạo cây phân cấp
  const newRecords = tree(records as TreeItem[]);

  // Thêm thông tin log
  await addLogInfoToTree(newRecords as LogNode[]);

  res.json({
    code: 200,
    message: "Thành công!",
    records: newRecords,
    filterStatus: filterStatusHelpers(req.query),
    keyword: objectSearch.keyword,
  });
};

// [PATCH] /admin/articles-category/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await ArticleCategory.updateOne(
      { _id: id },
      { status: status, $push: { updatedBy: updatedBy } }
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /admin/articles-category/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const type: string = req.body.type;
    const ids: string[] = req.body.ids.split(", ");
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    enum Key {
      ACTIVE = "active",
      INACTIVE = "inactive",
      DELETEALL = "delete-all",
      CHANGEPOSITION = "change-position",
    }
    switch (type) {
      case Key.ACTIVE:
        await ArticleCategory.updateMany(
          { _id: { $in: ids } },
          { status: "active", $push: { updatedBy: updatedBy } }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} bài viết!`,
        });
        break;
      case Key.INACTIVE:
        await ArticleCategory.updateMany(
          { _id: { $in: ids } },
          { status: "inactive", $push: { updatedBy: updatedBy } }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} bài viết!`,
        });
        break;
      case Key.DELETEALL:
        await ArticleCategory.updateMany(
          { _id: { $in: ids } },
          { deleted: "true", deletedAt: new Date() }
        );
        res.json({
          code: 200,
          message: `Đã xóa thành công ${ids.length} bài viết!`,
        });
        break;
      case Key.CHANGEPOSITION:
        interface Item {
          id: string;
          position: number;
        }
        for (const item of ids) {
          let [id, position] = item.split("-");
          await ArticleCategory.updateOne(
            { _id: { $in: id } },
            { position: Number(position), $push: { updatedBy: updatedBy } }
          );
        }
        res.json({
          code: 200,
          message: `Đã đổi vị trí thành công ${ids.length} bài viết!`,
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [DELETE] /admin/articles-category/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    await ArticleCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );
    res.json({
      code: 200,
      message: `Đã xóa thành công bài viết!`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /admin/articles-category/create
export const createPost = async (req: Request, res: Response) => {
  try {
    if (req.body.position == "") {
      const count = await ArticleCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

    const records = new ArticleCategory(req.body);
    await records.save();

    res.json({
      code: 200,
      message: `Đã thêm thành công bài viết!`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /admin/articles-category/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    req.body.position = parseInt(req.body.position);
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await ArticleCategory.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );
    res.json({
      code: 200,
      message: `Đã cập nhật thành công bài viết!`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [GET] /admin/articles-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await ArticleCategory.findOne(find);
    res.json({
      code: 200,
      message: `Đã cập nhật thành công bài viết!`,
      record: record,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
