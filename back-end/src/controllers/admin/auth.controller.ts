import Account from '~/models/account.model'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'
import { COOKIE_OPTIONS } from '~/utils/constants'

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const accountAdmin = await Account.findOne({
      email: email,
      deleted: false
    }).select('+password') // Bị chặn bởi select = false nên phải dùng dấu "+"

    if (!accountAdmin) {
      return res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác'
      })
    }

    const isMatch = await bcrypt.compare(password, accountAdmin.password)
    if (!isMatch) {
      return res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác'
      })
    }

    if (accountAdmin.status === 'inactive') {
      return res.json({
        code: 403,
        message: 'Tài khoản đã bị khóa!'
      })
    }

    const payload = {
      accountId: accountAdmin._id,
      email: accountAdmin.email,
      role_id: accountAdmin.role_id 
    }

    // Ký và tạo JWT
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_ADMIN as string, 
      { expiresIn: '15m' } // Token hết hạn sau 15 phút
    )

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET_ADMIN as string,
      { expiresIn: '7d' } // Refresh token hết hạn sau 7 ngày
    )

    await Account.updateOne(
      { _id: accountAdmin._id },
      { refreshToken: refreshToken }
    )

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Chỉ gửi qua HTTPS
      sameSite: 'none', // 'strict' an toàn hơn cho trang admin
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      path: '/admin/auth/refresh-token' // Chỉ gửi cookie này đến endpoint làm mới token
    })
    
    res.json({
      code: 200,
      message: 'Đăng nhập thành công!',
      accessToken: accessToken,
      accountAdmin: accountAdmin
    })

  } catch (error) {
    console.error("LỖI ĐĂNG NHẬP ADMIN:", error);
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error.message
    })
  }
}

// [GET] /admin/auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.json({
        code: 401,
        message: 'Không tìm thấy token!'
      })
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_ADMIN as string) as jwt.JwtPayload

    const account = await Account.findOne({
      _id: decoded.accountId,
      refreshToken: refreshToken,
      deleted: false,
      status: 'active'
    })

    if (!account) {
      return res.json({
        code: 401,
        message: 'Token không hợp lệ!'
      })
    }

    const payload = {
      accountId: account._id,
      email: account.email,
      role_id: account.role_id 
    }

    const newAccessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_ADMIN as string,
      { expiresIn: '15m' }
    )

    res.json({
      code: 200,
      message: 'Làm mới token thành công!',
      accessToken: newAccessToken
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error.message
    })
  }
}
// [GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(accessToken as string, process.env.JWT_SECRET_ADMIN as string) as jwt.JwtPayload 
    await Account.updateOne(
      { _id: decoded.accountId },
      { refreshToken: null }
    )
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/admin/auth/refresh-token'
    })

    res.json({
      code: 200,
      message: 'Đăng xuất thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error.message
    })
  }
}

