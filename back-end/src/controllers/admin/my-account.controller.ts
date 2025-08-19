import { Request, Response } from 'express'
import Account from '~/models/account.model'
import md5 from 'md5'
import Role from '~/models/role.model'

// [GET] /admin/my-account
export const index = async (req: Request, res: Response) => {
  try {
    const myAccount = await Account.findOne({ _id: req['accountAdmin'].id, deleted: false })
    const role = await Role.findOne({ _id: myAccount.role_id, deleted: false })
    if (myAccount && role) {
      res.json({
      code: 200,
      message: 'Thành công!',
      myAccount: myAccount,
      role: role
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

// [PATCH] /admin/my-account/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const isEmailExist = await Account.findOne({
      _id: { $ne: req['accountAdmin'].id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: req.body.email,
      deleted: false
    })
    if (isEmailExist) {
      res.json({
        code: 409,
        message: `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`
      })
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password) // Mã hóa password mới để lưu lại vào db
      } else {
        delete req.body.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
      }
      await Account.updateOne({ _id: req['accountAdmin'].id }, req.body)
      res.json({
        code: 200,
        message: 'Cập nhật thành công tài khoản!'
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
