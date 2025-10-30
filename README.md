### Dự án Luxues Store (Website E-commerce Thời trang Full-Stack) (Vẫn đang trong quá trình cập nhật thêm tính năng và tối ưu cho web mượt hơn)

Đây là một dự án website thương mại điện tử (E-commerce) thời trang full-stack hoàn chỉnh, bao gồm trang web cho khách hàng (Client) và hệ thống quản trị (Admin). Dự án được xây dựng trên kiến trúc MERN (MongoDB, Express, React, Node) nhưng được hiện đại hóa với Vite, TypeScript, và JWT.

- Link Deploy Frontend (Vercel): [https://luxues-store-demt-pvym.vercel.app]

- Link Deploy Backend (Render): [https://luxues-store.onrender.com]

1. Các Tính năng Nổi bật

Dự án được chia thành hai phần riêng biệt: front-end (Client) và back-end (Admin/API).

1.1. Client (Trang người dùng)

- Xác thực (Authentication):

  - Đăng ký và Đăng nhập bằng bcrypt (băm mật khẩu) và JWT (JSON Web Token).

  - Sử dụng httpOnly cookie để lưu trữ token, tăng cường bảo mật (chống XSS).

  - Đăng nhập bằng Google (OAuth 2.0): Tích hợp Passport.js để cho phép đăng nhập/đăng ký nhanh qua Google.

  - Luồng "Quên mật khẩu" an toàn sử dụng JWT tạm thời gửi qua email (hoặc mã OTP).

- Mua sắm (Shopping):

  - Logic giỏ hàng (Cart) nâng cao: Tự động tạo giỏ hàng cho khách vãng lai. Khi khách đăng nhập, hệ thống tự động gộp giỏ hàng (merge cart) của khách vào giỏ hàng của tài khoản.

  - Trang sản phẩm với bộ lọc (Filter) đa cấp: Lọc theo Danh mục (đa cấp), Giá (thanh trượt), Màu sắc, và Kích cỡ.

  - Sắp xếp (Sort) sản phẩm: Sắp xếp theo "Mặc định" (vị trí), Tên (A-Z, Z-A), và đặc biệt là sắp xếp theo Giá khuyến mãi (tính toán qua Aggregation).

  - Trang chi tiết sản phẩm với gallery ảnh (Image Swiper), chọn màu sắc, kích cỡ, và xem đánh giá.

- Tìm kiếm:

  - Tìm kiếm "cổ điển" (nhấn Enter) để chuyển đến trang kết quả (có phân trang).
 
  - Gợi ý tìm kiếm (suggestions) real-time (sử dụng debounce) ngay dưới thanh tìm kiếm.

- Tài khoản người dùng (Private Routes):

  - Trang thông tin tài khoản (cập nhật avatar, thông tin).
 
  - Trang "Đơn hàng của tôi" (xem lịch sử, lọc đơn hàng).
 
  - Hủy đơn hàng (nếu trạng thái cho phép).
 
  - Đánh giá sản phẩm: Cho phép người dùng đã mua hàng để lại đánh giá (rating) và upload ảnh.

- Chat Real-time:

  - Sử dụng Socket.io để chat 1-1 với Admin.
 
  - Tự động xác thực qua httpOnly cookie khi kết nối socket.
 
  - Hiển thị dưới dạng bong bóng chat (chat bubble) tiện lợi.

1.2. Admin (Trang quản trị)

- Xác thực Admin: Hệ thống đăng nhập riêng biệt, sử dụng JWT (cookie tokenAdmin) và bcrypt.

- Phân quyền (Authorization): Tích hợp logic role_id vào JWT payload để kiểm soát quyền truy cập cho từng API (ví dụ: Super Admin vs. Biên tập viên).

- Dashboard: Tổng quan về doanh thu, đơn hàng, người dùng mới.

- Quản lý CRUD đầy đủ:

  - Quản lý Sản phẩm (Thêm, Sửa, Xóa, Cập nhật trạng thái).
 
  - Quản lý Đơn hàng (Xem chi tiết, cập nhật trạng thái: Đang xử lý -> Vận chuyển -> Hoàn thành...).
 
  - Quản lý Thương hiệu (Brand) & Danh mục Thương hiệu.
 
  - Quản lý Người dùng (Client) & Tài khoản (Admin).
 
  - Quản lý Phân quyền (Role).

- Xuất file Excel:

  - Tính năng xuất toàn bộ danh sách đơn hàng (đã lọc) ra file .xlsx bằng exceljs ở backend.

- Chat Real-time (Admin View):

  - Giao diện 2 cột, hiển thị tất cả các cuộc trò chuyện của khách hàng.
 
  - Nhận tin nhắn real-time và trả lời trực tiếp cho từng khách hàng.

2. Công nghệ sử dụng (Tech Stack)

2.1. Frontend (Thư mục front-end)

- Framework/Library: React 19, Vite

- Ngôn ngữ: TypeScript

- Styling: Tailwind CSS, Framer Motion (cho hiệu ứng)

- Routing: React Router v7+

- State Management: React Context

- API Client: Axios

- Real-time: Socket.io-client

- Components: Material-UI (MUI) (cho Skeleton, Menu, Dialog), Swiper.js (cho sliders)

2.2. Backend (Thư mục back-end)

- Framework: Node.js, Express.js

- Ngôn ngữ: TypeScript

- Database: MongoDB (với Mongoose)

- Xác thực: jsonwebtoken (JWT), bcrypt (Hashing), passport, passport-google-oauth20

- Real-time: Socket.io

- API: REST API, Cookie-Parser, CORS

- File Upload: Multer (xử lý file), Cloudinary (lưu trữ ảnh)

- Khác: exceljs (Xuất file Excel), mongoose-slug-updater

2.3. Deployment

- Frontend: Vercel (kết nối với front-end và vercel.json cho SPA routing)

- Backend: Render (kết nối với back-end và chạy npm run build & npm run start)

3. Cài đặt và Chạy dự án (Local)

- Đây là một dự án Monorepo (quản lý trong 2 thư mục riêng biệt).

3.1. Cài đặt Backend

1. Mở một terminal, cd vào thư mục back-end:

`cd back-end`

2. Cài đặt các gói:

`npm install`


3. Tạo file .env ở gốc thư mục back-end và điền các biến môi trường:
```
# Cổng chạy server
PORT=8080

# Link database MongoDB của bạn
MONGO_URL=mongodb+srv://...

# Link frontend (để cấu hình CORS)
CLIENT_URL=http://localhost:5173

# Các khóa bí mật (TỰ TẠO CHUỖI NGẪU NHIÊN, PHỨC TẠP)
JWT_SECRET=daylachuoibimatratphuctapcuaban_thaydoino
JWT_SECRET_ADMIN=DAY_LA_KHOA_BI_MAT_CHO_ADMIN_CUC_KY_AN_TOAN
JWT_SECRET_RESET=daylachuoibimatkhac_dungdechoresetmatkhau

# Google OAuth (Lấy từ Google Cloud Console)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
API_ROOT=http://localhost:8080 # Dùng cho Google Callback
```

4. Khởi động server backend:

 `npm run dev`


3.2. Cài đặt Frontend

1. Mở một terminal thứ hai, cd vào thư mục front-end:

`cd front-end`


2. Cài đặt các gói:

`npm install`


3. Tạo file .env.development ở gốc thư mục front-end:
```
# Link đến API backend đang chạy ở local
VITE_API_ROOT=http://localhost:8080
```

4. Khởi động server frontend:

`npm run dev`


5. Mở trình duyệt và truy cập http://localhost:5173.
