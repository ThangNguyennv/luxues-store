import { Router } from 'express'
const router: Router = Router()
import multer from 'multer'
import * as controller from '~/controllers/admin/setting.controller'
import uploadCloud from '~/middlewares/admin/uploadCloud.middleware'
import * as validate from '~/validates/admin/settingGeneral.validate'

router.get('/general', controller.index)
router.patch(
  '/general/edit',
  multer().single('logo'),
  uploadCloud,
  validate.editPatch, // middleware
  controller.generalPatch
)

export const settingRoutes: Router = router
