import { Router } from 'express'
import * as controller from '~/controllers/admin/brands-category.controller'

const router: Router = Router()

router.get('/', controller.index)
router.post('/create', controller.createPost)
router.get('/detail/:id', controller.detail)
router.patch('/edit/:id', controller.editPatch)
router.delete('/delete/:id', controller.deleteItem)

export const brandCategoryRoutes: Router = router
