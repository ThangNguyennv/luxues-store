import { Router } from 'express'
import * as controller from '~/controllers/client/brand.controller'

const router: Router = Router()

// Route cho client lấy tất cả thương hiệu
router.get('/', controller.getAllBrands)

export const brandClientRoutes: Router = router
