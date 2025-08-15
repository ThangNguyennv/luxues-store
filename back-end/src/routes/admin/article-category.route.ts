import { Router } from 'express'
const router: Router = Router()

import * as controller from '~/controllers/admin/article-category.controller'
// Upload ảnh
import multer from 'multer'
import uploadCloud from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validates/admin/products-category.validate'

router.get('/', controller.index)
// router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)
router.delete('/delete/:id', controller.deleteItem)
router.post(
  '/create',
  multer().single('thumbnail'),
  uploadCloud,
  validate.createPost, // middleware
  controller.createPost
)
router.patch(
  '/edit/:id',
  multer().single('thumbnail'),
  uploadCloud,
  validate.createPost, // middleware
  controller.editPatch
)
router.get('/detail/:id', controller.detail)
router.patch('/change-status-with-children/:status/:id', controller.changeStatusWithChildren)

export const articleCategoryRoutes: Router = router
