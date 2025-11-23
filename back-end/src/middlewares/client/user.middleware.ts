import { Request, Response, NextFunction } from 'express'
import User from '~/models/user.model'
import jwt from 'jsonwebtoken'

export const infoUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenUser = req.cookies.tokenUser 
  if (tokenUser) {
    try {
      // Xác thực token
      const decoded = jwt.verify(tokenUser, process.env.JWT_SECRET as string) as { userId: string }

      const user = await User.findOne({
        _id: decoded.userId,
        deleted: false,
        status: 'active'
      }).select('-password')
    
      if (user) {
        req['accountUser'] = user 
      }
    } catch (error) {
      // Nếu token hết hạn/sai, chỉ cần xóa cookie cũ
      res.clearCookie('tokenUser')
    }
  }
  next() // Luôn luôn gọi next()
}
