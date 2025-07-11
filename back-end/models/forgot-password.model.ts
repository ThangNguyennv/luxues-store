import mongoose from "mongoose";

// Sử dụng mongoose, buộc phải tuần theo Schema này, nếu chẳng may có người thêm các thuộc tính linh tinh khác vào thì nó sẽ không lưu vào database.
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    // Thuộc tính tự có trong mongoose (Thời gian hiện tại + 10 giây)
    expireAt: {
      type: Date,
      expires: 600,
    },
  },
  //timestamps là một cách tiện lợi để tự động thêm và quản lý hai trường thời gian tiêu chuẩn trong mỗi document: createdAt – thời điểm document được tạo, updatedAt – thời điểm document được cập nhật lần cuối
  {
    timestamps: true,
  }
);

// Tham số thứ ba là tên collection trong database
const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

export default ForgotPassword;
