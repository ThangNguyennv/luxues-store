import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/product.controller'
// Upload ảnh
import multer from 'multer'
import { uploadCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
router.get('/', controller.index)
router.get('/suggestions', controller.getSearchSuggestions)
router.get('/:slugCategory', controller.category)
router.get('/detail/:slugProduct', controller.detail)
router.get('/related/:productId', controller.getRelatedProducts); // <-- THÊM DÒNG NÀY
router.post(
  '/:productId/reviews',
  multer().array('images', 5), // Cho phép upload tối đa 5 ảnh
  uploadCloud,
  controller.createReview // Một controller mới
)
router.get('/reviews/top-rated', controller.getTopRatedReviews)
export const productRoutes: Router = router
