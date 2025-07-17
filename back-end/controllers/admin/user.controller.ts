import { Request, Response } from 'express'
import User from '../../models/user.model'
import md5 from 'md5'

// [GET] /admin/users
export const index = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false
    }
    const records = await User.find(find).select('-password -token')
    res.json({
      code: 200,
      message: 'Thành công!',
      records: records
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/users/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status
    const id = req.params.id
    await User.updateOne({ _id: id }, { status: status })
    res.json({
      code: 200,
      message: 'Cập nhật trạng thái thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/users/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const isEmailExist = await User.findOne({
      _id: { $ne: req.params.id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: req.body.email,
      deleted: false
    })
    if (isEmailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`
      })
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password) // Mã hóa password mới để lưu lại vào db
      } else {
        delete req.body.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
      }
      await User.updateOne({ _id: req.params.id }, req.body)
      res.json({
        code: 200,
        message: 'Đã cập nhật thành công người dùng!'
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

// [GET] /admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const record = await User.findOne(find)
    res.json({
      code: 200,
      message: 'Chi tiết người dùng!',
      record: record
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [DELETE] /admin/users/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    await User.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() })
    res.json({
      code: 200,
      message: 'Đã xóa thành công người dùng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
