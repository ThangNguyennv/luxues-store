import mongoose from 'mongoose'

// Sử dụng mongoose, buộc phải tuần theo Schema này, nếu chẳng may có người thêm các thuộc tính linh tinh khác vào thì nó sẽ không lưu vào database.
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
  //timestamps là một cách tiện lợi để tự động thêm và quản lý hai trường thời gian tiêu chuẩn trong mỗi document: createdAt – thời điểm document được tạo, updatedAt – thời điểm document được cập nhật lần cuối
  {
    timestamps: true
  }
)

// Tham số thứ ba là tên collection trong database
const Order = mongoose.model('Order', orderSchema, 'orders')

export default Order
