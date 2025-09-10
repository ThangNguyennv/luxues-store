import { Request, Response } from 'express'
import User from '~/models/user.model'
import ForgotPassword from '~/models/forgot-password.model'
import Cart from '~/models/cart.model'
import md5 from 'md5'
import * as generateHelper from '~/helpers/generate'
import * as sendMailHelper from '~/helpers/sendMail'

// [POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const { fullName, email } = req.body
    const isFullName = await User.findOne({
      fullName: fullName
    })
    if (isFullName) {
      res.json({
        code: 401,
        message: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!'
      })
      return
    }
    const isExistEmail = await User.findOne({
      email: email
    })
    if (isExistEmail) {
      res.json({
        code: 401,
        message: 'Email đã tồn tại, vui lòng chọn email khác!'
      })
      return
    }
    req.body.password = md5(req.body.password)
    req.body.confirmPassword = md5(req.body.confirmPassword)
    const user = new User(req.body)
    await user.save()
    res.json({
      code: 200,
      message: 'Đăng ký tài khoản thành công, mời bạn đăng nhập lại để tiếp tục!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error,
    })
  }
}

// [POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      email: email,
      deleted: false
    })
    if (!user) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }
    if (md5(password) !== user.password) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }
    if (user.status === 'inactive') {
      res.json({
        code: 403,
        message: 'Tài khoản đang bị khóa!'
      })
      return
    }
    const cart = await Cart.findOne({
      user_id: user._id
    })
    if (cart) {
      res.cookie('cartId', cart._id)
    } else {
      await Cart.updateOne(
        {
          _id: req.cookies.cartId
        },
        {
          user_id: user._id
        }
      )
    }
    res.cookie('tokenUser', user.tokenUser, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    })
    res.json({
      code: 200,
      message: 'Đăng nhập thành công!',
      tokenUser: user.tokenUser
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /user/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('tokenUser')
    res.clearCookie('cartId')
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

// [POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email
    const user = await User.findOne({
      email: email,
      deleted: false
    })
    if (!user) {
      res.json({
        code: 401,
        message: 'Email không tồn tại!'
      })
      return
    }

    // Lưu thông tin vào db
    const otp = generateHelper.generateRandomNumber(6)
    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now()
    }
    const record = await ForgotPassword.findOne({
      email: email
    })
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    // Tránh trường hợp gửi otp liên tục mà phải hết hạn otp đó thì mới gửi otp khác.
    if (!record) {
      res.json({
        code: 200,
        message:
          'Mã OTP đã được gửi qua email của bạn, vui lòng kiểm tra email!'
      })
      await forgotPassword.save()
    }
    // Nếu tồn tại email thì gửi mã OTP qua email
    const subject = 'Mã OTP xác minh lấy lại mật khẩu'
    const html = `
      Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 2 phút.
    `
    sendMailHelper.sendMail(email, subject, html)
  } catch (error) {
   res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /user/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email
    const otp = req.body.otp
    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp
    })
    if (!result) {
      res.json({
        code: 401,
        message: 'OTP không hợp lệ!'
      })
      return
    }
    const user = await User.findOne({
      email: email
    })
    res.cookie('tokenUser', user.tokenUser)
    res.json({
      code: 200,
      message: 'Mã OTP hợp lệ!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
    await User.updateOne(
      {
        tokenUser: tokenUser
      },
      {
        password: md5(password)
      }
    )
    res.json({
      code: 200,
      message: 'Đổi mật khẩu thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /user/info
export const info = async (req: Request, res: Response) => {
  try {
    const tokenUser = req.cookies.tokenUser
    const accountUser = await User.findOne({
      tokenUser: tokenUser,
      deleted: false
    })
    res.json({
      code: 200,
      message: 'Thông tin tài khoản!',
      accountUser: accountUser
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /user/info/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const isEmailExist = await User.findOne({
      _id: { $ne: req['accountUser'].id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: req.body.email,
      deleted: false
    })
    if (isEmailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`
      })
    } else {
      await User.updateOne({ _id: req['accountUser'].id }, req.body)
      res.json({
        code: 200,
        message: 'Đã cập nhật thành công tài khoản!'
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /user/info/edit/change-password
export const changePasswordPatch = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      _id: req['accountUser'].id,
      deleted: false
    })
    if (user) {
      if (md5(req.body.currentPassword) != user.password) {
        res.json({
          code: 400,
          message: 'Mật khẩu hiện tại không chính xác, vui lòng nhập lại!'
        })
        return
      }
      if (req.body.password) {
        req.body.password = md5(req.body.password) // Mã hóa password mới để lưu lại vào db
      } else {
        delete req.body.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
      }
      await User.updateOne({ email: req['accountUser'].email }, req.body)
      res.json({
        code: 200,
        message: 'Đã đổi mật khẩu tài khoản thành công!'
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
