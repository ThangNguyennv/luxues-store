import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import * as cookie from 'cookie'

export const chatSocket = (io: Server) => {
  io.use((socket: Socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie
      if (!cookies) {
        return next(new Error('Authentication error: No cookies found.'))
      }

      const parsedCookies = cookie.parse(cookies)
      const tokenUser = parsedCookies.tokenUser
      const tokenAdmin = parsedCookies.token

      if (tokenAdmin) {
        // Xác thực Admin (Account)
        const decoded = jwt.verify(tokenAdmin, process.env.JWT_SECRET_ADMIN as string) as { accountId: string, role_id: string }
        if (!decoded.accountId) {
          return next(new Error('Authentication error: Invalid admin token.'))
        }
        // Gán thông tin vào socket để dùng sau
        socket.data.adminId = decoded.accountId
        socket.data.role = 'admin'
        return next()
      } else if (tokenUser) {
        // Xác thực Client (User)
        const decoded = jwt.verify(tokenUser, process.env.JWT_SECRET as string) as { userId: string }
        if (!decoded.userId) {
          return next(new Error('Authentication error: Invalid user token.'))
        }
        // Gán thông tin vào socket để dùng sau
        socket.data.userId = decoded.userId
        socket.data.role = 'user'
        return next()
      } else {
        return next(new Error('Authentication error: No token provided.'))
      }
    } catch (error) {
        console.error('Socket Auth Error:', error.message)
        return next(new Error('Authentication error: ' + error.message))
    }
  })
}