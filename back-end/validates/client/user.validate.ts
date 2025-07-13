import { Request, Response, NextFunction } from "express";

export const registerPost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
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

export const forgotPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: `Vui lòng nhập email!`,
    });
    return;
  }
  next();
};

export const resetPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.password) {
    res.json({
      code: 400,
      message: `Vui lòng nhập mật khẩu!`,
    });
    return;
  }
  if (!req.body.confirmPassword) {
    res.json({
      code: 400,
      message: `Vui lòng xác nhận nhập mật khẩu!`,
    });
    return;
  }
  if (req.body.password != req.body.confirmPassword) {
    res.json({
      code: 400,
      message: `Mật khẩu không khớp!`,
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

export const changePasswordPatch = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.currentPassword) {
    res.json({
      code: 400,
      message: `Vui lòng nhập mật khẩu hiện tại!`,
    });
    return;
  }
  if (!req.body.password) {
    res.json({
      code: 400,
      message: `Vui lòng nhập mật khẩu mới!`,
    });
    return;
  }
  if (!req.body.confirmPassword) {
    res.json({
      code: 400,
      message: `Vui lòng xác nhận nhập mật khẩu!`,
    });
    return;
  }
  if (req.body.password != req.body.confirmPassword) {
    res.json({
      code: 400,
      message: `Mật khẩu không khớp!`,
    });
    return;
  }
  next();
};
