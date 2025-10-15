import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/product.controller'

router.get('/', controller.index)
router.get('/suggestions', controller.getSearchSuggestions)
router.get('/:slugCategory', controller.category)
router.get('/detail/:slugProduct', controller.detail)
router.get('/related/:productId', controller.getRelatedProducts); // <-- THÊM DÒNG NÀY

export const productRoutes: Router = router
