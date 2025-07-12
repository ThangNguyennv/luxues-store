import { Request, Response } from "express";

import ProductCategory from "../../models/product-category.model";
import systemConfig from "../../config/system";
import filterStatusHelpers from "../../helpers/filterStatus";
import searchHelpers from "../../helpers/search";
import { tree, TreeItem } from "../../helpers/createTree";
import { addLogInfoToTree, LogNode } from "../../helpers/addLogInfoToChildren";

// [GET] /admin/products-category
export const index = async (req: Request, res: Response) => {
  try {
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

    const records = await ProductCategory.find(find).sort(sort);

    const newRecords = tree(records as TreeItem[]);

    // Add log info to all nodes (parent and children)
    await addLogInfoToTree(newRecords as LogNode[]);
    res.json({
      code: 200,
      message: "Thành công!",
      records: newRecords,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /admin/products-category/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
      account_id: req["accountAdmin"].id,
      updatedAt: new Date(),
    };
    await ProductCategory.updateOne(
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
      message: "Lỗi",
    });
  }
};

// [PATCH] /admin/products-category/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] };
    const type = body.type;
    const ids = body.ids;
    const updatedBy = {
      account_id: req["accountAdmin"].id,
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
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { status: Key.ACTIVE, $push: { updatedBy: updatedBy } }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`,
        });
        break;
      case Key.INACTIVE:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { status: Key.INACTIVE, $push: { updatedBy: updatedBy } }
        );
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`,
        });
        break;
      case Key.DELETEALL:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { deleted: "true", deletedAt: new Date() }
        );
        res.json({
          code: 200,
          message: `Đã xóa thành công ${ids.length} sản phẩm!`,
        });
        break;
      case Key.CHANGEPOSITION:
        for (const item of ids) {
          let [id, position] = item.split("-");
          await ProductCategory.updateOne(
            { _id: { $in: id } },
            { position: Number(position), $push: { updatedBy: updatedBy } }
          );
        }
        res.json({
          code: 200,
          message: `Đã đổi vị trí thành công ${ids.length} sản phẩm!`,
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

// [DELETE] /admin/products-category/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await ProductCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: req["accountAdmin"].id,
          deletedAt: new Date(),
        },
      }
    );
    res.json({
      code: 200,
      message: `Đã xóa thành công sản phẩm!`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /admin/products-category/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
      account_id: req["accountAdmin"].id,
    };
    const records = new ProductCategory(req.body);
    await records.save();
    res.json({
      code: 200,
      message: `Đã thêm thành công sản phẩm!`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [PATCH] /admin/products-category/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    req.body.position = parseInt(req.body.position);
    const updatedBy = {
      account_id: req["accountAdmin"].id,
      updatedAt: new Date(),
    };
    await ProductCategory.updateOne(
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
      message: `Đã cập nhật thành công sản phẩm!`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [GET] /admin/products-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await ProductCategory.findOne(find);
    res.json({
      code: 200,
      message: "Thành công!",
      record: record,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
