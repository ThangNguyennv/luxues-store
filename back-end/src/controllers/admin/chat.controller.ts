import { Request, Response } from 'express'
import Chat from '~/models/chat.model'

// Lấy danh sách tất cả các cuộc trò chuyện
export const getAdminChatRooms = async (req: Request, res: Response) => {
  try {
    const chatRooms = await Chat.find()
      .populate('user_id', 'fullName avatar') // Lấy thông tin user
      .sort({ lastMessageAt: -1 }) // Sắp xếp theo tin nhắn mới nhất
      .lean() // Dùng .lean() để tăng tốc độ

    // (Tùy chọn) Thêm logic để lấy tin nhắn cuối cùng cho mỗi room
    
    res.json({ code: 200, chatRooms })
  } catch (error) {
    console.error('Lỗi khi lấy admin chat rooms:', error)
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}

// Lấy toàn bộ lịch sử của một phòng chat cụ thể
export const getAdminChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const chat = await Chat.findOne({ user_id: userId })
      .populate('user_id', 'fullName avatar')

    if (!chat) {
      return res.json({ code: 404, message: 'Không tìm thấy cuộc trò chuyện.' })
    }
    res.json({ code: 200, chat })
  } catch (error) {
    console.error('Lỗi khi lấy admin chat history:', error)
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}