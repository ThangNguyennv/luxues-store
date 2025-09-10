import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    // user_id: String,
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String
    },
    position: Number,
    products: [
      {
        product_id: String,
        title: String,
        price: Number,
        quantity: Number,
        discountPercentage: Number,
        thumbnail: String
      }
    ],
    status: {
      type: String,
      default: 'waiting'
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ],
    deletedBy: {
      account_id: String,
      deletedAt: Date
    }
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', orderSchema, 'orders')

export default Order
