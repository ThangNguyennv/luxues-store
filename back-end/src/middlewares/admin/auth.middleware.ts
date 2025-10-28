// import { Request, Response, NextFunction } from 'express'
// import Account from '~/models/account.model'

// export const requireAuth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const token = req.cookies.token
//   if (token) {
//     const accountAdmin = await Account.findOne({
//       token: token,
//       deleted: false
//     }).select('-password')

//     if (!accountAdmin) {
//       res.json({
//         code: 401,
//         message: 'Token không hợp lệ!'
//       })
//       return
//     }
//     req['accountAdmin'] = accountAdmin
//     next()
//   } else {
//     res.json({
//       code: 401,
//       message: 'Vui lòng gửi kèm token!',
//     })
//     return
//   }
// }


import { Request, Response, NextFunction } from 'express'
import Account from '~/models/account.model'
import jwt from 'jsonwebtoken'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token 
  if (!token) {
    res.json({
      code: 401,
      message: 'Vui lòng gửi kèm token!'
    })
    return
  }

  try {
    // Xác thực chữ ký của token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN as string) as { 
      accountId: string,
      email: string,
      role_id: string  
    }

    // Tìm user bằng ID lấy từ payload của token
    const accountAdmin = await Account.findOne({
      _id: decoded.accountId,
      deleted: false
    }).select('-password')
  
    if (!accountAdmin) {
      res.json({ code: 401, message: 'Token không hợp lệ!' })
      return
    }

    req['accountAdmin'] = accountAdmin
    next()

  } catch (error) {
    // Nếu token hết hạn hoặc không hợp lệ, jwt.verify sẽ ném lỗi
    res.json({
      code: 401,
      message: 'Token không hợp lệ hoặc đã hết hạn!'
    })
    return
  }
}