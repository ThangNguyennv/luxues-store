import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '~/models/user.model'

// Cấu hình chiến lược Google OAuth2
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  
  // URL này phải khớp 100% với "Authorized redirect URI" bạn đã cấu hình
  // trên Google Cloud Console.
  // Đảm bảo biến 'API_ROOT' (ví dụ: http://localhost:3100) có trong file .env của backend.
  callbackURL: `${process.env.API_ROOT}/user/auth/google/callback`,
  
  passReqToCallback: false // Đặt là false, chúng ta không cần `req` trong callback
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // 1. Lấy thông tin cơ bản từ Google profile
    const googleId = profile.id
    const email = profile.emails?.[0].value
    const fullName = profile.displayName
    const avatar = profile.photos?.[0].value

    // Nếu Google không trả về email, đây là một lỗi
    if (!email) {
      return done(new Error('Không thể lấy email từ Google.'), false)
    }

    // 2. Tìm người dùng bằng Google ID
    let user = await User.findOne({ googleId: googleId })

    // Kịch bản 1: Người dùng đã tồn tại (đã đăng nhập bằng Google trước đó)
    if (user) {
      return done(null, user)
    }

    // Kịch bản 2: Không tìm thấy bằng Google ID, thử tìm bằng email
    // (Trường hợp người dùng đã đăng ký bằng email/password trước đó)
    user = await User.findOne({ email: email })

    if (user) {
      // Nếu tìm thấy, cập nhật `googleId` để "liên kết" tài khoản
      user.googleId = googleId
      // Cập nhật avatar nếu họ chưa có
      user.avatar = user.avatar || avatar
      await user.save()
      return done(null, user)
    }

    // Kịch bản 3: Người dùng hoàn toàn mới
    const newUser = new User({
      googleId: googleId,
      email: email,
      fullName: fullName,
      avatar: avatar
      // Mật khẩu là 'required: false' trong model, nên chúng ta không cần đặt
      // 'status' sẽ là 'active' (default)
    })

    await newUser.save()
    return done(null, newUser)

  } catch (error) {
    return done(error as Error, false)
  }
}
))

// Lưu ý: Chúng ta không cần serialize/deserialize User
// vì chúng ta đang dùng JWT (stateless).
// Passport chỉ dùng để xác thực một lần tại route callback.

