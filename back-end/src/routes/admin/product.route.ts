import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import uploadCloud from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as controller from '~/controllers/admin/product.controller'
import * as validate from '~/validates/admin/product.validate'
import { parseProductData } from '~/middlewares/admin/parseProductData.middleware'; 

router.get('/', controller.index)
router.patch('/change-multi', controller.changeMulti)
router.post(
  '/create',
  multer().array('files', 15), // Nhận tối đa 15 files với tên trường là 'files'
  uploadCloud,
  parseProductData,
  validate.createPost, // middleware
  controller.createPost
)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.delete('/delete/:id', controller.deleteItem)
router.patch(
  '/edit/:id',
  multer().array('files', 15), // Nhận tối đa 15 files với tên trường là 'files'
  uploadCloud,
  validate.createPost, // middleware
  controller.editPatch
)
router.get('/detail/:id', controller.detail)

export const productRoutes: Router = router
