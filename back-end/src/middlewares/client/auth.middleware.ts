import { Request, Response, NextFunction } from 'express'
import User from '~/models/user.model'

// export const requireAuth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   if (req.headers.authorization) {
//     const tokenUser = req.headers.authorization.split(' ')[1]
//     const user = await User.findOne({
//       tokenUser: tokenUser,
//       deleted: false
//     }).select('-password')
//     if (!user) {
//       res.json({
//         code: 401,
//         message: 'Token không hợp lệ!'
//       })
//       return
//     }
//     req['accountUser'] = user
//     next()
//   } else {
//     res.json({
//       code: 401,
//       message: 'Vui lòng gửi kèm token!'
//     })
//   }
// }

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tokenUser = req.cookies.tokenUser 
  if (tokenUser) {
    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false
    }).select('-password')
  
    if (!user) {
      res.json({
        code: 401,
        message: 'Token không hợp lệ!'
      })
      return
    }
    req['accountUser'] = user
    next()
  } else {
    res.json({
      code: 401,
      message: 'Vui lòng gửi kèm token!'
    })
    return
  }
}
