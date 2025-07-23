import { Request, Response, NextFunction } from 'express'
import Account from '~/models/account.model'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token
  if (token) {
    const accountAdmin = await Account.findOne({
      token: token,
      deleted: false
    }).select('-password')

    if (!accountAdmin) {
      res.json({
        code: 400,
        message: 'Token không hợp lệ!'
      })
      return
    }
    req['accountAdmin'] = accountAdmin
    next()
  } else {
    res.json({
      code: 400,
      message: 'Vui lòng gửi kèm token!',
    })
    return
  }
}
