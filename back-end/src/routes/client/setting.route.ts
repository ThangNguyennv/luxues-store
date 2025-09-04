import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/setting.controller'

router.get('/general', controller.index)

export const settingRoutes: Router = router
