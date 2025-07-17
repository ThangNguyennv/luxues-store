import { Router } from 'express'
const router: Router = Router()
import multer from 'multer'
import * as controller from '~/controllers/admin/setting.controller'
import uploadCloud from '~/middlewares/admin/uploadCloud.middleware'

router.patch(
  '/general',
  multer().single('logo'),
  uploadCloud,
  controller.generalPatch
)

export const settingRoutes: Router = router
