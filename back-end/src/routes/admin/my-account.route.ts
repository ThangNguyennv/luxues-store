import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import uploadCloud from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validates/admin/account.validate'
import * as controller from '~/controllers/admin/my-account.controller'

router.get('/', controller.index) // detail
router.patch(
  '/edit',
  multer().single('avatar'),
  uploadCloud,
  validate.editPatch, // middleware
  controller.editPatch
)

export const myAccountRoutes: Router = router
