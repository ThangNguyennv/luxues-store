// import express, { Express } from 'express'
// import path from 'path'
// import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'
// import session from 'express-session'
// import http from 'http'
// import dotenv from 'dotenv'
// import { Server } from 'socket.io'
// dotenv.config()
// import cors from 'cors'
// import * as database from './src/config/database'
// import systemConfig from './src/config/system'
// import routeClient from './src/routes/client/index.route'
// import routeAdmin from './src/routes/admin/index.route'
// import { chatSocket } from './src/middlewares/sockets/chatSocket.middleware'
// import { chatSocketBrain } from '~/sockets/chat.socket'

// database.connect()

// const app: Express = express()
// const port: number | string = process.env.PORT || 3000

// // ✅ Dùng biến môi trường và cho phép cả local + production
// const allowedOrigins = [
//   'http://localhost:5173',
//   process.env.CLIENT_URL
// ].filter(Boolean) // Loại bỏ undefined

// app.use(cors({
//   origin: allowedOrigins, // FE origin
//   credentials: true, // Cho phép gửi cookie từ FE
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],     // Các phương thức HTTP được phép
//   allowedHeaders: ['Content-Type', 'Authorization']     // Cho phép các header cần thiết
// }))

// // Socket IO
// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins, // Cho phép client React kết nối
//     credentials: true
//   }
// })

// app.options('*', cors())

// global._io = io
// // MIDDLEWARE XÁC THỰC CHO SOCKET.IO
// chatSocket(io)
  
// // LOGIC XỬ LÝ CHAT REAL-TIME
// chatSocketBrain(io)
// // End Socket IO

// // Parse JSON bodies
// app.use(bodyParser.json())

// app.use(cookieParser('dfdfsadasd'))
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,         // khuyến nghị: không lưu lại nếu session chưa thay đổi
//   saveUninitialized: false, // khuyến nghị: không tạo session trống
//   cookie: { maxAge: 60000 }
// }))

// // Tinymce
// app.use(
//   '/tinymce',
//   express.static(path.join(__dirname, 'node_modules', 'tinymce'))
// )
// // End Tinymce

// // App Locals Variables
// app.locals.prefixAdmin = systemConfig.prefixAdmin

// // giúp Express phục vụ các file tĩnh trong thư mục public mà không cần viết route thủ công.
// app.use(express.static(`${__dirname}/public`)) 

// routeAdmin(app)
// routeClient(app)

// server.listen(port, () => {
//   // eslint-disable-next-line no-console
//   console.log(`Example app listening on port ${port}`)
// })

import express, { Express } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
dotenv.config()
import cors from 'cors'
import * as database from './src/config/database'
import systemConfig from './src/config/system'
import routeClient from './src/routes/client/index.route'
import routeAdmin from './src/routes/admin/index.route'
import { chatSocket } from './src/middlewares/sockets/chatSocket.middleware'
import { chatSocketBrain } from '~/sockets/chat.socket'

database.connect()

const app: Express = express()
const port: number | string = process.env.PORT || 3000

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean)

console.log('🔥 Allowed Origins:', allowedOrigins)
console.log('🔧 System Config:', systemConfig)

// ✅ 1. CORS trước tiên
app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 Request from:', origin)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    console.log('❌ Origin blocked:', origin)
    return callback(new Error('Not allowed by CORS'), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// ✅ 2. Preflight requests
app.options('*', cors())

// ✅ 3. Body parser
app.use(bodyParser.json())

// ✅ 4. Cookie & Session
app.use(cookieParser('dfdfsadasd'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 60000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}))

// ✅ 5. Static files
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))
app.use(express.static(`${__dirname}/public`))

// ✅ 6. App locals
app.locals.prefixAdmin = systemConfig.prefixAdmin

// ✅ 7. Routes với error handling
console.log('📍 Loading Admin routes...')
try {
  routeAdmin(app)
  console.log('✅ Admin routes loaded')
} catch (error) {
  console.error('❌ Admin routes error:', error)
  process.exit(1)
}

console.log('📍 Loading Client routes...')
try {
  routeClient(app)
  console.log('✅ Client routes loaded')
} catch (error) {
  console.error('❌ Client routes error:', error)
  process.exit(1)
}

// ✅ 8. Socket.IO (SAU KHI routes đã load)
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
})

global._io = io
chatSocket(io)
chatSocketBrain(io)

// ✅ 9. Start server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
})
