import { Request, Response } from "express";
import Account from "../../models/account.model";
import Role from "../../models/role.model";

import md5 from "md5";

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  let find = {
    deleted: false,
  };
  // Dấu '-': Loại bỏ các trường password và token khỏi kết quả.
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record["role"] = role;
  }
  res.json(records);
};

// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const isEmailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });
    if (isEmailExist) {
      res.json({
        code: 400,
        message: "Email đã tồn tại, vui lòng chọn email khác!",
      });
      return;
    } else {
      // md5() -> Mật khẩu sẽ bị mã hóa khi gửi lên db
      req.body.password = md5(req.body.password);

      const record = new Account(req.body);
      await record.save();
      res.json({
        code: 200,
        message: "Thêm tài khoản thành công!",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
      error: error,
    });
  }
};

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;

    await Account.updateOne({ _id: id }, { status: status });

    res.json({
      code: 200,
      message: " Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const isEmailExist = await Account.findOne({
      _id: { $ne: req.params.id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: req.body.email,
      deleted: false,
    });
    if (isEmailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`,
      });
      return;
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password); // Mã hóa password mới để lưu lại vào db
      } else {
        delete req.body.password; // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
      }
      await Account.updateOne({ _id: req.params.id }, req.body);
      res.json({
        code: 200,
        message: "Đã cập nhật thành công tài khoản!",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const roles = await Role.find({
      deleted: false,
    });
    const record = await Account.findOne(find);
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record["role"] = role;
    res.json({
      code: 200,
      message: "Thành công!",
      record: record,
      roles: roles,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại sản phẩm này!",
    });
  }
};

// [DELETE] /admin/accounts/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Account.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
    res.json({
      code: 200,
      message: "Đã xóa thành công tài khoản!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};
