import mongoose, { Schema } from 'mongoose'

// Định nghĩa một tin nhắn
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'admin'], // Ai là người gửi?
      required: true
    },
    content: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false // Trạng thái đã đọc/chưa đọc
    }
  },
  {
    timestamps: true // Tự động thêm createdAt
  }
)

// Định nghĩa một cuộc trò chuyện (phòng chat)
const chatSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Liên kết với model User (client)
      required: true,
      unique: true // Mỗi user chỉ có 1 phòng chat
    },
    messages: [messageSchema], // Mảng chứa các tin nhắn
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

const Chat = mongoose.model('Chat', chatSchema, 'chats')

export default Chat
