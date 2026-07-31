const messageModel = require("../models/message-model");
const userModel = require("../models/user-model");
let socketMapID = {};

function messageSocketsConnection(io) {
  io.on("connection", (socket) => {
    console.log("uiser connected", socket.id);

    socket.on("register", (username) => {
      socketMapID[username] = socket.id;
      console.log(socketMapID);
    });

    socket.on("call-user", ({ username, offer, from }) => {
      console.log("calling to", username);
      socket
        .to(socketMapID[username])
        .emit("call-user", { username, offer, from });
    });

    socket.on("call:ended", ({ to }) => {
      console.log("called tell to", to);
      socket.to(socketMapID[to]).emit("call:ended", { callended: true });
    });

    socket.on("call-accepted", ({ answer, from }) => {
      console.log(answer, from);
      socket.to(socketMapID[from]).emit("call-accepted", { answer, from });
    });

    socket.on("ice-candidate", ({ candidate, to, from }) => {
      console.log("this is candidate", from, candidate);
      io.to(socketMapID[to]).emit("ice-candidate", { candidate });
    });

    console.log(socket.id);
    socket.on("chat-msg", async ({ msg, to, from }) => {
      let room = socketMapID[to];
      console.log("Room ID: send ", to, room);

      console.log("Message from client:", msg);
      // Broadcast the message to all connected clients
      if (!room) return console.log("somew erro occured");
      let sender = await userModel.findOne({ username: from });
      let receiver = await userModel.findOne({ username: to });
      console.log(sender.fullname, receiver.fullname);
      if (!sender || !receiver) return;
      let createdMsg = await messageModel.create({
        from,
        to,
        senderId: sender._id,
        receiverId: receiver._id,
        msg,
      });

      console.log(createdMsg);
      socket.to(room).emit("chat-msg", createdMsg);
    });

    socket.on("check-online-friends", async ({ friends }) => {
      console.log("firends", friends);
      friends = friends.filter((val) => {
        if (socketMapID[val]) {
          return val;
        }
      });
      console.log("online friends", friends);
      socket.emit("check-online-friends", friends);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id, socketMapID);
      for (let user in socketMapID) {
        if (socketMapID[user] === socket.id) {
          delete socketMapID[user];
          break;
        }
      }
    });
  });
}

module.exports = messageSocketsConnection;
