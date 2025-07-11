import { Request, Response, NextFunction } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.fullName) {
    res.json({
      code: 400,
      message: `Vui lòng nhập họ tên!`,
    });
    return;
  }

  if (!req.body.email) {
    res.json({
      code: 400,
      message: `Vui lòng nhập email!`,
    });
    return;
  }

  if (!req.body.password) {
    res.json({
      code: 400,
      message: `Vui lòng nhập mật khẩu!`,
    });
    return;
  }
  next();
};

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.fullName) {
    res.json({
      code: 400,
      message: `Vui lòng nhập họ tên!`,
    });
    return;
  }

  if (!req.body.email) {
    res.json({
      code: 400,
      message: `Vui lòng nhập email!`,
    });
    return;
  }
  next();
};
