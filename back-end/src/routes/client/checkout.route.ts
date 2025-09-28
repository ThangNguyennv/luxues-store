import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/checkout.controller'
import { momoCallback } from '~/helpers/momoPayment'
import { vnpayReturn } from '~/helpers/vnpayPayment'
import { vnpayIpn } from '~/helpers/vnpayPayment'
import { zalopayCallback } from '~/helpers/zalopayPayment'

router.get('/', controller.index)
router.post('/order', controller.order)

// vnpay
router.get('/vnpay-return', vnpayReturn)
router.get("/vnpay-ipn", vnpayIpn) 

// zalopay
router.post('/zalopay-callback', zalopayCallback)

// momo
router.post('/momo-callback', momoCallback)

router.get('/success/:orderId', controller.success)

export const checkoutRoutes: Router = router
