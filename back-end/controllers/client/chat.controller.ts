const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /admin/chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // Socket IO
  // Dùng .on thì load lại trang sẽ tạo ra nhiều socket và gửi lên database nhiều lần
  // Còn dùng .once thì chỉ tạo ra 1 socket và gửi lên database 1 lần
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        content: content,
      });
      await chat.save();

      // Trả data về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        fullName: fullName,
        content: content,
      });
    });
  });
  // End Socket IO

  // Lấy data từ database
  const chats = await Chat.find({
    deleted: false,
  });
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.infoUser = infoUser;
  }
  // Hết Lấy data từ database

  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat",
    chats: chats,
  });
};
