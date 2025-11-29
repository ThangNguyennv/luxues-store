import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/auth.controller'
import * as validate from '~/validates/admin/auth.validate'

router.post('/login', validate.loginPost, controller.loginPost)
router.get('/logout', controller.logout)
router.post('/refresh-token', controller.refreshToken)
export const authRoutes: Router = router
