import { Router } from 'express'
const router: Router = Router()

import * as controller from '~/controllers/admin/account.controller'
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validates/admin/account.validate'

router.get('/', controller.index)
router.post(
  '/create',
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.createPost, // middleware
  controller.createPost
)
router.patch('/change-status/:status/:id', controller.changeStatus)
// Bắt đầu chỉnh sửa sản phẩm và gửi form đi.
router.patch(
  '/edit/:id',
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.editPatch, // middleware
  controller.editPatch
)
router.get('/detail/:id', controller.detail)
router.delete('/delete/:id', controller.deleteItem)

export const accountRoutes: Router = router
