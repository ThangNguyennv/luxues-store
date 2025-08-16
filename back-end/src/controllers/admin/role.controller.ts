import { Request, Response } from 'express'

import Role from '~/models/role.model'
import Account from '~/models/account.model'

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false
    }

    const roles = await Role.find(find)
    for (const record of roles) {
      // Lấy ra thông tin người cập nhật
      const updatedBy = record.updatedBy[record.updatedBy.length - 1] // Lấy phần tử cuối của mảng updatedBy
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id
        })
        updatedBy['accountFullName'] = userUpdated.fullName
      }
    }
    res.json({
      code: 200,
      message: 'Thành công!',
      roles: roles
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const record = new Role(req.body)
    await record.save()
    res.json({
      code: 201,
      message: 'Tạo thành công nhóm quyền!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await Role.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy
        }
      }
    )
    res.json({
      code: 200,
      message: 'Đã cập nhật thành công sản phẩm!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [DELETE] /admin/roles/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    await Role.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: req['accountAdmin'].id,
          deletedAt: new Date()
        }
      }
    )
    res.json({
      code: 204,
      message: 'Đã xóa thành công sản phẩm!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const record = await Role.findOne(find)
    res.json({
      code: 200,
      message: 'Thành công!',
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

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
  try {
    const permissionRequireList = req.body.permissions
    for (const item of permissionRequireList) {
      const existing = await Role.findById(item.id)
      if (!existing) {
        continue
      }
      const mergedPermissions = Array.from(
        new Set([...(existing.permissions || []), ...item.permissions])
      )
      await Role.updateOne(
        { _id: item.id },
        {
          permissions: mergedPermissions
        }
      )
    }
    res.json({
      code: 200,
      message: 'Cập nhật phân quyền thành công',
      body: req.body
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
