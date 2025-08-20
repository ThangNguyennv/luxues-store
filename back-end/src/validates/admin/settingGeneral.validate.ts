import { Request, Response, NextFunction } from 'express'

export const editPatch = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.websiteName) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập tên website!'
    })
    return
  }
  if (!req.body.email) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập email!'
    })
    return
  }
  if (!req.body.copyright) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập bản quyền!'
    })
    return
  }
  next()
}
