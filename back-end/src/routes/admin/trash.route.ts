import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/trash.controller'

router.get('/', controller.trash)
router.delete('/change-multi', controller.changeMulti)
router.delete('/permanently-delete/:id', controller.permanentlyDeleteItem)
router.patch('/recover/:id', controller.recoverItem)

export const trashRoutes: Router = router
