import { Request, Response, NextFunction } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    res.json({
      code: 400,
      message: `Vui lòng nhập tiêu đề!`,
    });
    return;
  }
  next();
};
