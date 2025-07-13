import { Request, Response } from "express";
import Product from "../../models/product.model";
import filterStatusHelpers from "../../helpers/filterStatus";
import searchHelpers from "../../helpers/search";
import paginationHelpers from "../../helpers/pagination";

// [GET] /admin/trash
export const trash = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean;
      status?: string;
      title?: RegExp;
    }
    let find: Find = {
      deleted: true,
    };

    if (req.query.status) {
      find.status = req.query.status.toString();
    }

    const objectSearch = searchHelpers(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
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

    res.json({
      code: 200,
      message: "Thành công!",
      products: products,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [DELETE] /admin/trash/form-change-multi-trash
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] };
    const type = body.type;
    const ids = body.ids;
    enum Key {
      DELETEALL = "delete-all",
      RECOVER = "recover",
    }
    switch (type) {
      case Key.DELETEALL:
        await Product.deleteMany({ _id: { $in: ids } });
        res.json({
          code: 200,
          message: `Đã xóa vĩnh viễn thành công ${ids.length} sản phẩm!`,
        });
        break;
      case Key.RECOVER:
        await Product.updateMany(
          { _id: { $in: ids } },
          { deleted: false, recoveredAt: new Date() }
        );
        res.json({
          code: 200,
          message: `Đã khôi phục thành công ${ids.length} sản phẩm!`,
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

// [DELETE] /admin/trash/permanently-delete/:id
export const permanentlyDeleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Product.deleteOne({ _id: id });
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

// // [PATCH] /admin/trash/recover/:id
// module.exports.recoverItem = async (req, res) => {
//   const id = req.params.id;

//   await Product.updateOne(
//     { _id: id },
//     { deleted: false, recoveredAt: new Date() }
//   );
//   req.flash("success", `Đã khôi phục thành công sản phẩm!`);

//   // Không bị quay về trang 1 khi thay đổi trạng thái hoạt động
//   const backURL = req.get("Referrer") || "/";
//   res.redirect(backURL);
// };
