import mongoose from 'mongoose'
import * as generate from '../helpers/generate'

// Sử dụng mongoose, buộc phải tuần theo Schema này, nếu chẳng may có người thêm các thuộc tính linh tinh khác vào thì nó sẽ không lưu vào database.
const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20)
    }, // Giống id - là duy nhất -> Chứng tỏ “ai đó đã được xác thực và có quyền làm gì” (proof + metadata + an toàn)
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  //timestamps là một cách tiện lợi để tự động thêm và quản lý hai trường thời gian tiêu chuẩn trong mỗi document: createdAt – thời điểm document được tạo, updatedAt – thời điểm document được cập nhật lần cuối
  {
    timestamps: true
  }
)

// Tham số thứ ba là tên collection trong database
const Account = mongoose.model('Account', accountSchema, 'accounts')

export default Account
