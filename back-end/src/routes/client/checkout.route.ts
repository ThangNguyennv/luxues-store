import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/checkout.controller'

router.get('/', controller.index)
router.post('/order', controller.order)
router.get('/check-payment-vnpay', controller.vnpayReturn)
router.get('/success/:orderId', controller.success)

export const checkoutRoutes: Router = router
