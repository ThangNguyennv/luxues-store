import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/order.controller'

router.get('/', controller.index)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)
router.delete('/delete/:id', controller.deleteItem)
router.delete('/permanentlyDelete/:id', controller.permanentlyDeleteItem)
router.get('/detail/:id', controller.detail)
router.patch('/recover/:id', controller.recoverPatch)

export const orderRoutes: Router = router
