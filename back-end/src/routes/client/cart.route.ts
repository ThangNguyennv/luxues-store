import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/cart.controller'

router.get('/', controller.index)
router.post('/add/:productId', controller.addPost)
router.delete('/delete/:productId', controller.deleteCart)
router.patch('/change-multi', controller.changeMulti)
router.patch('/update/:productId/:quantity', controller.update)

export const cartRoutes: Router = router
