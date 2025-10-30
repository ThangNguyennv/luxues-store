import { Request, Response } from 'express'
import User from '~/models/user.model'
import ForgotPassword from '~/models/forgot-password.model'
import Cart from '~/models/cart.model'
import md5 from 'md5'
import * as generateHelper from '~/helpers/generate'
import * as sendMailHelper from '~/helpers/sendMail'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import Order from '~/models/order.model'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 

// [POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body
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
    if (password !== confirmPassword) {
      res.json({
        code: 400,
        message: 'Mật khẩu xác nhận không khớp!'
      })
      return
    }

    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(password, salt)
    delete req.body.confirmPassword 

    const user = new User(req.body)
    await user.save()
    res.json({
      code: 200,
      message: 'Đăng ký tài khoản thành công, mời bạn đăng nhập lại để tiếp tục!'
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({
      email: email,
      deleted: false
    }).select('+password')
    
    if (!user) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }
    if (user.status === 'inactive') {
      return res.json({
        code: 403,
        message: 'Tài khoản đang bị khóa!'
      })
    }

    // Tạo JWT
    const payload = { userId: user._id, email: user.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1d' // Token hết hạn sau 1 ngày
    })

    const cart = await Cart.findOne({
      user_id: user._id
    })
    if (cart) {
      res.cookie('cartId', cart._id)
    } else {
      await Cart.updateOne({ _id: req.cookies.cartId }, {user_id: user._id })
    }

    const userInfo = user.toObject()
    delete userInfo.password

    // Gửi JWT về client qua cookie
    res.cookie('tokenUser', token, {
      httpOnly: true, // Chỉ server có thể truy cập
      secure: true, // Chỉ gửi qua HTTPS ở môi trường production
      sameSite: 'none', 
      maxAge: 24 * 60 * 60 * 1000 
    })
    res.json({
      code: 200,
      message: 'Đăng nhập thành công!',
      tokenUser: token,
      accountUser: userInfo
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [GET] /user/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('tokenUser', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0) // Hết hạn ngay lập tức
    })
    res.cookie('cartId', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0)
    })
    res.json({
      code: 200,
      message: 'Đăng xuất thành công!'
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email, deleted: false })
    if (!user) {
      return res.json({ code: 401, message: 'Email không tồn tại!' })
    }

    // TẠO RESET TOKEN BẰNG JWT
    // Tạo token tạm thời chỉ có hiệu lực 15 phút
    const payload = { userId: user._id }
    const resetToken = jwt.sign(payload, process.env.JWT_SECRET_RESET as string, {
      expiresIn: '15m'
    })

    // // Lưu thông tin vào db
    // const otp = generateHelper.generateRandomNumber(6)
    // const objectForgotPassword = {
    //   email: email,
    //   otp: otp,
    //   expireAt: Date.now()
    // }
    // const record = await ForgotPassword.findOne({
    //   email: email
    // })
    // const forgotPassword = new ForgotPassword(objectForgotPassword)
    // // Tránh trường hợp gửi otp liên tục mà phải hết hạn otp đó thì mới gửi otp khác.
    // if (!record) {
    //   res.json({
    //     code: 200,
    //     message:
    //       'Mã OTP đã được gửi qua email của bạn, vui lòng kiểm tra email!'
    //   })
    //   await forgotPassword.save()
    // }
    // // Nếu tồn tại email thì gửi mã OTP qua email
    // const subject = 'Mã OTP xác minh lấy lại mật khẩu'
    // const html = `
    //   Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 2 phút.
    // `

    // Tạo link reset (Giả sử frontend của bạn có route /user/password/reset)
    // BẠN CẦN THÊM BIẾN NÀY VÀO FILE .env
    const clientUrl = process.env.CLIENT_URL
    const resetLink = `${clientUrl}/user/password/reset?token=${resetToken}`

    const subject = 'Yêu cầu lấy lại mật khẩu'
    const html = `
      <p>Bạn đã yêu cầu lấy lại mật khẩu. Vui lòng nhấp vào đường link dưới đây:</p>
      <a href="${resetLink}" target="_blank">Lấy lại mật khẩu</a>
      <p>Đường link này sẽ hết hạn sau 15 phút.</p>
    `
    sendMailHelper.sendMail(email, subject, html)
    res.json({
      code: 200,
      message: 'Chúng tôi đã gửi một link lấy lại mật khẩu qua email của bạn. Vui lòng kiểm tra hộp thư.'
    })
  } catch (error) {
   res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// // [POST] /user/password/otp
// export const otpPasswordPost = async (req: Request, res: Response) => {
//   try {
//     const email = req.body.email
//     const otp = req.body.otp
//     const result = await ForgotPassword.findOne({
//       email: email,
//       otp: otp
//     })
//     if (!result) {
//       res.json({
//         code: 401,
//         message: 'OTP không hợp lệ!'
//       })
//       return
//     }
//     const user = await User.findOne({
//       email: email
//     })
//     res.cookie('tokenUser', user.tokenUser)
//     res.json({
//       code: 200,
//       message: 'Mã OTP hợp lệ!'
//     })
//   } catch (error) {
//     res.json({
//       code: 400,
//       message: 'Lỗi!',
//       error: error
//     })
//   }
// }

// [POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const { password, token } = req.body

    if (!token) {
      return res.json({ code: 401, message: 'Token không hợp lệ hoặc đã hết hạn.' })
    }

    // Xác thực reset token
    let payload: any
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_RESET as string)
    } catch (verifyError) {
      return res.json({ code: 401, message: 'Token không hợp lệ hoặc đã hết hạn.' })
    }
    // Băm mật khẩu mới
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    await User.updateOne(
      { _id: payload.userId },
      { password: hashedPassword }
    )
    res.json({
      code: 200,
      message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập.'
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [GET] /user/info
export const info = async (req: Request, res: Response) => {
  try {
    const accountUser = req['accountUser'] 
    res.json({
      code: 200,
      message: 'Thông tin tài khoản!',
      accountUser: accountUser
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
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
    } 

    // Xóa các trường nhạy cảm không được phép cập nhật
    delete req.body.password
    delete req.body.tokenUser
    await User.updateOne({ _id: req['accountUser'].id }, req.body)
    res.json({
      code: 200,
      message: 'Đã cập nhật thành công tài khoản!'
    })
    
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [PATCH] /user/info/edit/change-password
export const changePasswordPatch = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      _id: req['accountUser'].id,
      deleted: false
    })

    if (!user) {
      return res.json({ code: 404, message: 'Không tìm thấy người dùng.' })
    }

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password)
    if (!isMatch) {
      return res.json({ code: 400, message: 'Mật khẩu hiện tại không chính xác, vui lòng nhập lại!' })
    }

    const salt = await bcrypt.genSalt(10)
    const newHashedPassword = await bcrypt.hash(req.body.password, salt)

    await User.updateOne(
      { _id: req['accountUser'].id }, 
      { password: newHashedPassword }
    )

    res.json({
      code: 200,
      message: 'Đã đổi mật khẩu tài khoản thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /user/my-orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const find: any = { }
    const { status, date } = req.query
    const useId = req["accountUser"].id
    // Filter
    find.user_id = useId
    find.deleted = false
    if (status) {
      find.status = status
    }
    if (date) {
      const startDate = new Date(date.toString()) // Bắt đầu từ 00:00:00 của ngày được chọn
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date.toString()) // Kết thúc vào 23:59:59 của ngày được chọn
      endDate.setHours(23, 59, 59, 999)

      // Tìm các đơn hàng có `createdAt` nằm trong khoảng thời gian của ngày đó
      find.createdAt = {
        $gte: startDate, // Lớn hơn hoặc bằng thời điểm bắt đầu ngày
        $lte: endDate    // Nhỏ hơn hoặc bằng thời điểm kết thúc ngày
      }
    }
    // End filter

    // Search
    const objectSearch = searchHelpers(req.query)
    if (objectSearch.keyword) {
      find._id = new mongoose.Types.ObjectId(objectSearch.keyword)
    }
    // End search

    // Pagination
    const countOrders = await Order.countDocuments(find)
    const objectPagination = paginationHelpers(
      {
        currentPage: 1,
        limitItems: 5
      },
      req.query,
      countOrders
    )
    // End Pagination

    // Sort
    let sort: Record<string, any> = {}
    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toLocaleString()
      sort[sortKey] = req.query.sortValue
    } 
    // End Sort

    const orders = await Order
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)

    // Sort chay do không sài hàm sort() kia cho các thuộc tính không có trong db.
    if (req.query.sortKey === 'price' && req.query.sortValue) {
      const dir = req.query.sortValue === 'desc' ? -1 : 1
      orders.sort((a, b) => dir * (a['price'] - b['price']))
    }
  
    res.json({
      code: 200,
      message: 'Thành công!',
      orders: orders,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /user/my-orders/cancel-order/:id
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id
    await Order.updateOne(
      { _id: orderId },
      { status: 'CANCELED' }
    )
    res.json({
      code: 200,
      message: 'Hủy thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /user/auth/google/callback
export const googleCallback = async (req: Request, res: Response) => {
  try {
    // 1. Nhận user từ Passport (đã được xác thực bởi passport.ts)
    const user = req.user as any

    if (!user) {
      // Chuyển hướng về trang đăng nhập của React với thông báo lỗi
      return res.redirect(`${process.env.CLIENT_URL}/user/login?error=auth_failed`);
    }

    // 2. Logic giỏ hàng (giống hệt loginPost)
    const cart = await Cart.findOne({ user_id: user._id });
    if (cart) {
      res.cookie('cartId', cart._id);
    } else if (req.cookies.cartId) {
      // Nếu có giỏ hàng khách, gán nó cho người dùng
      await Cart.updateOne(
        { _id: req.cookies.cartId },
        { user_id: user._id }
      );
    } // Nếu không có giỏ hàng khách, middleware cartId sẽ tự tạo giỏ hàng mới

    // 3. Tạo JWT (token đăng nhập chính)
    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1d' // Token hết hạn sau 1 ngày
    });

    // 4. Gửi JWT về client qua cookie
    res.cookie('tokenUser', token, {
      httpOnly: true, // Chỉ server có thể truy cập
      secure: true, // Chỉ gửi qua HTTPS ở môi trường production
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 
    })

    // 5. Chuyển hướng người dùng về trang chủ React
    res.redirect(process.env.CLIENT_URL as string);

  } catch (error) {
    console.error("LỖI GOOGLE CALLBACK:", error);
    res.redirect(`${process.env.CLIENT_URL}/user/login?error=server_error`);
  }
}