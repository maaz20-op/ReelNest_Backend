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

    socket.on("initialize-call-request", ({ to, from, callingUser }) => {
      console.log("calling reuqest from", from, "to", to);
      socket
        .to(socketMapID[to])
        .emit("initialize-call-request", { to, from, callingUser });
    });

    socket.on("call-user", ({ username, offer, from }) => {
      console.log("calling to", username, offer);
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
        console.log("call ended tell to", to);
        socket
          .to(socketMapID[to])
          .emit("call:ended", {
            callended: true,
            declined: isDeclined,
            isCallEndedBeforeRemoteExpect: isCallEndedBeforeConnection,
          });
      },
    );

    socket.on("call-accepted", ({ answer, from }) => {
      console.log("answer", answer, from);
      socket.to(socketMapID[from]).emit("call-accepted", { answer, from });
    });

    socket.on("ice-candidate", ({ candidate, to, from }) => {
      console.log("Candidate received on server from:", from, "to:", to);

      const targetSocketId = socketMapID[to];

      if (targetSocketId) {
        // ✅ io.to use karein specific socket ID ko emit karne ke liye
        io.to(targetSocketId).emit("ice-candidate", { candidate, from });
        console.log(
          `Candidate forwarded successfully to ${to} (${targetSocketId})`,
        );
      } else {
        console.error(
          `User ${to} is not online or socket ID missing in socketMapID!`,
        );
      }
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
