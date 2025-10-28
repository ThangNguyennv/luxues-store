import { Request, Response } from 'express'
import Chat from '~/models/chat.model'

// Lấy hoặc tạo phòng chat cho client đang đăng nhập
export const getClientChat = async (req: Request, res: Response) => {
  try {
    const userId = req['accountUser']._id 

    // Tìm, hoặc tạo mới nếu chưa có
    let chat = await Chat.findOne({ user_id: userId })
    if (!chat) {
      chat = new Chat({ user_id: userId, messages: [] })
      await chat.save()
    }
    res.json({ code: 200, chat })
  } catch (error) {
    console.error('Lỗi khi lấy client chat:', error)
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}
