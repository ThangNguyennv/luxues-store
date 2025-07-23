import Account from '~/models/account.model'
import md5 from 'md5'
import { Request, Response } from 'express'

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const accountAdmin = await Account.findOne({
      email: email,
      deleted: false
    })
    if (!accountAdmin) {
      res.json({
        code: 400,
        message: 'Email không tồn tại!'
      })
      return
    }
    if (md5(password) != accountAdmin.password) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác'
      })
      return
    }
    if (accountAdmin.status == 'inactive') {
      res.json({
        code: 402,
        message: 'Tài khoản đã bị khóa!'
      })
      return
    }
    // Tạo token lưu trên cookie
    res.cookie('token', accountAdmin.token, {
      httpOnly: true,     // ngăn JS đọc được token
      secure: true,       // chỉ gửi qua HTTPS
      sameSite: 'none',    //  'None' nếu dùng nhiều domain
      maxAge: 24 * 60 * 60 * 1000  // 1 ngày
    })
    res.json({
      code: 200,
      message: 'Đăng nhập thành công!',
      token: accountAdmin.token
    })
  } catch (error) {
    res.json({
      code: 403,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/auth/logout
export const logout = (req: Request, res: Response) => {
  // Xóa token trong cookie
  try {
    res.clearCookie('token')
    res.json({
      code: 200,
      message: 'Đăng xuất thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
