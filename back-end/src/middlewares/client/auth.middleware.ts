import { Request, Response, NextFunction } from 'express'
import User from '~/models/user.model'
import jwt from 'jsonwebtoken'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tokenUser = req.cookies.tokenUser 
  if (!tokenUser) {
    res.json({
      code: 401,
      message: 'Vui lòng gửi kèm token!'
    })
    return
  }

  try {
    // Xác thực chữ ký của token
    const decoded = jwt.verify(tokenUser, process.env.JWT_SECRET as string) as { userId: string }

    const user = await User.findOne({
      _id: decoded.userId,
      deleted: false
    }).select('-password')
  
    if (!user) {
      res.json({ code: 401, message: 'Token không hợp lệ!' })
      return
    }

    req['accountUser'] = user
    next()

  } catch (error) {
    res.json({
      code: 401,
      message: 'Token không hợp lệ hoặc đã hết hạn!'
    })
    return
  }
}