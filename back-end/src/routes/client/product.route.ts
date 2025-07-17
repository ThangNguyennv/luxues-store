import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/product.controller'

router.get('/', controller.index)
router.get('/:slugCategory', controller.category)
router.get('/detail/:slugProduct', controller.detail)

export const productRoutes: Router = router
