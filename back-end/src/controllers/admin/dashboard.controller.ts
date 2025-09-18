import { Request, Response } from 'express'
import Product from '~/models/product.model'
import User from '~/models/user.model'
import Order from '~/models/order.model'

// [GET] /admin/dashboard
export const dashboard = async (req: Request, res: Response) => {
  try {
    const statistic = {
      user: {
        total: 0,
      },
      product: {
        total: 0,
      },
      order: {
        total: 0,
      },
      revenue: {
        total: 0,
      }
    }
    
    const orders = await Order.find({
      'paymentInfo.status': 'PAID'
    })

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)

    statistic.user.total = await User.countDocuments({
      deleted: false
    })

    statistic.product.total = await Product.countDocuments({
      deleted: false
    })

    statistic.order.total = await Order.countDocuments({
      deleted: false
    })

    statistic.revenue.total = totalRevenue

    res.json({
      code: 200,
      message: 'Thành công!',
      statistic: statistic
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
