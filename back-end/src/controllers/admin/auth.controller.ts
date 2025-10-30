import Account from '~/models/account.model'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const accountAdmin = await Account.findOne({
      email: email,
      deleted: false
    }).select('+password') 

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
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET_ADMIN as string, 
      { expiresIn: '1d' } // Token hết hạn sau 1 ngày
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Chỉ gửi qua HTTPS
      sameSite: 'none', // 'strict' an toàn hơn cho trang admin
      maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    })
    
    res.json({
      code: 200,
      message: 'Đăng nhập thành công!',
      token: token,
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

// [GET] /admin/auth/logout
export const logout = (req: Request, res: Response) => {
  try {
    // Xóa cookie với tên mới 'token'
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0) // Hết hạn ngay lập tức
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

