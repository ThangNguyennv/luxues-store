import mongoose, { Schema } from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true
    },
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String
    },
    amount: {
      type: Number,
      required: true
    },
    note: String,
    paymentInfo: {
      method: {
        type: String,
        enum: ['COD', 'VNPAY', 'MOMO', 'ZALOPAY'],
      },
      status: { 
        type: String, 
        enum: ['PENDING', 'PAID', 'FAILED'], 
        default: 'PENDING' 
      },
      details: { 
        type: Object, default: {} 
      }
    },
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
      enum: ['PENDING', 'TRANSPORTING', 'CONFIRMED', 'CANCELED'],
      default: 'PENDING',
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      account_id: String
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
