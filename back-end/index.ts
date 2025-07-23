import express, { Express } from 'express'
import path from 'path'
import methodOverride from 'method-override'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'express-flash'
import moment from 'moment'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
dotenv.config()
import cors from 'cors'
import * as database from './src/config/database'
import systemConfig from './src/config/system'
import routeClient from './src/routes/client/index.route'
import routeAdmin from './src/routes/admin/index.route'

database.connect()

const app: Express = express()
const port: number | string = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:5173', // FE origin
  credentials: true, // Cho phép gửi cookie từ FE
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],     // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization']     // Cho phép các header cần thiết
}))

// Socket IO
const server = http.createServer(app)
const io = new Server(server)
global._io = io
// End Socket IO

app.use(methodOverride('_method'))

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded());

// Parse JSON bodies
app.use(bodyParser.json())

// flash
app.use(cookieParser('dfdfsadasd'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash())
// End flash

// Tinymce
app.use(
  '/tinymce',
  express.static(path.join(__dirname, 'node_modules', 'tinymce'))
)
// End Tinymce

// App Locals Variables (Tạo ra các biến toàn cục, file .pug nào cũng xài được, và chỉ đc sử dụng trong file .pug)
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

app.use(express.static(`${__dirname}/public`)) // Rất quan trọng, muốn cái gì public thì cho vào thư mục public còn lại là private

// Routes
routeAdmin(app)
routeClient(app)
// app.get("*", function (req, res) {
//   res.render("client/pages/errors/404.pug", {
//     pageTitle: "404 Not Found",
//   });
// });
app.use(function (req, res) {
  res.status(404).render('client/pages/errors/404.pug', {
    pageTitle: '404 Not Found'
  })
})

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`)
})
