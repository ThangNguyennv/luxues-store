import { Router } from 'express'
import multer from 'multer'
import uploadCloud from '~/middlewares/admin/uploadCloud.middleware'
import * as controller from '~/controllers/admin/brand.controller'
import * as validate from '~/validates/admin/brand.validate'

const router: Router = Router()

router.get('/', controller.index)

router.post(
  '/create',
  multer().single('thumbnail'), // Nhận file logo với field 'thumbnail'
  uploadCloud,
  validate.createPost,
  controller.createPost
)

router.get('/detail/:id', controller.detail)

router.patch(
  '/edit/:id',
  multer().single('thumbnail'), // Nhận file logo mới nếu có
  uploadCloud,
  validate.createPost,
  controller.editPatch
)

router.delete('/delete/:id', controller.deleteItem)

export const brandRoutes: Router = router
