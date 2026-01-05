const mongoose = require("mongoose");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports = (io) => {
  // ✅ auth bằng tokenLogin (random token lưu DB: tokenUser)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const user = await User.findOne({ tokenUser: token }).select("-password");
      if (!user) return next(new Error("Invalid or expired token"));

      socket.user = user;
      next();
    } catch (e) {
      console.error("socket auth error:", e);
      next(new Error("Server error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id, "user:", socket.user?._id);

    socket.on("JOIN_ROOM", ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log("🏠 JOIN_ROOM:", roomId);
    });

    socket.on("LEAVE_ROOM", ({ roomId }) => {
      if (!roomId) return;
      socket.leave(roomId);
      console.log("LEAVE_ROOM:", roomId);
    });

    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      try {
        console.log("CLIENT_SEND_MESSAGE:", data);

        const userId = socket.user._id;
        const fullName = socket.user.fullName;

        let images = [];
        if (Array.isArray(data.images) && data.images.length > 0) {
          for (const imageBuffer of data.images) {
            const link = await uploadToCloudinary.uploadToCloudinary(
              imageBuffer
            );
            images.push(link);
          }
        }
        const teamId = data.teamId || data.room_chat_id;
        if (!mongoose.Types.ObjectId.isValid(teamId)) return;
        // save DB
        const doc = new Chat({
          user_id: socket.user._id,
          room_key: roomKey, //  bắt buộc
          content: data.content || "",
          images,
          deleted: false,
        });
        await doc.save();

        const room = data.roomId || `team_${data.teamId}`;

        // emit lại cho cả người gửi + người trong room
        io.to(room).emit("SERVER_RETURN_MESSAGE", {
          _id: doc._id,
          userId,
          fullName,
          content: doc.content,
          images: doc.images,
          createdAt: doc.createdAt,
          tempId: data.tempId,
          teamId: data.teamId,
        });

        console.log("emitted to:", room);
      } catch (err) {
        console.error("send message error:", err);
      }
    });

    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: socket.user?._id,
        fullName: socket.user?.fullName,
        type,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected:", socket.id, reason);
    });
  });
};
