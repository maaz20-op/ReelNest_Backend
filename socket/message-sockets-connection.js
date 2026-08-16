const messageModel = require("../models/message-model");
const userModel = require("../models/user-model");
let socketMapID = {};

function messageSocketsConnection(io) {
  io.on("connection", (socket) => {
    console.log("user connected", socket?.id);

    socket.on("register", (username) => {
      socketMapID[username] = socket.id;
    });

    socket.on("initialize-call-request", ({ to, from, callingUser }) => {
      socket
        .to(socketMapID[to])
        .emit("initialize-call-request", { to, from, callingUser });
    });

    socket.on("call-user", ({ username, offer, from }) => {
      socket
        .to(socketMapID[username])
        .emit("call-user", { username, offer, from });
    });

    socket.on(
      "call:ended",
      ({ to, declined, isCallEndedBeforeRemoteExpect }) => {
        let isDeclined = declined;
        let isCallEndedBeforeConnection = isCallEndedBeforeRemoteExpect;
        if (!isDeclined) {
          isDeclined = false;
        }

        if (!isCallEndedBeforeConnection) isCallEndedBeforeConnection = false;

        socket.to(socketMapID[to]).emit("call:ended", {
          callended: true,
          declined: isDeclined,
          isCallEndedBeforeRemoteExpect: isCallEndedBeforeConnection,
        });
      },
    );

    socket.on("call-accepted", ({ answer, from }) => {
      socket.to(socketMapID[from]).emit("call-accepted", { answer, from });
    });

    socket.on("ice-candidate", ({ candidate, to, from }) => {
      const targetSocketId = socketMapID[to];

      if (targetSocketId) {
        // ✅ io.to use karein specific socket ID ko emit karne ke liye
        io.to(targetSocketId).emit("ice-candidate", { candidate, from });
      } else {
        console.error(
          `User ${to} is not online or socket ID missing in socketMapID!`,
        );
      }
    });

    socket.on("chat-msg", async ({ msg, to, from }) => {
      let room = socketMapID[to];

      // Broadcast the message to all connected clients
      if (!room) return console.error("No Room Found to Send Message!");
      let sender = await userModel.findOne({ username: from });
      let receiver = await userModel.findOne({ username: to });

      if (!sender || !receiver) return;
      let createdMsg = await messageModel.create({
        from,
        to,
        senderId: sender._id,
        receiverId: receiver._id,
        msg,
      });

      socket.to(room).emit("chat-msg", createdMsg);
    });

    socket.on("check-online-friends", async ({ friends }) => {
      friends = friends.filter((val) => {
        if (socketMapID[val]) {
          return val;
        }
      });

      socket.emit("check-online-friends", friends);
    });

    socket.on("disconnect", () => {
      for (let user in socketMapID) {
        if (socketMapID[user] === socket.id) {
          console.log("❌ Disconnected:", socketMapID[user]);
          delete socketMapID[user];
          break;
        }
      }
    });
  });
}

module.exports = messageSocketsConnection;
