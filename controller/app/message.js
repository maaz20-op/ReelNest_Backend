const messageModel = require("../../models/message-model");

module.exports.getMessages = async function (req) {
  const { chatedUserId, limit = 10, page = 1 } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  const messages = await messageModel
    .find({
      $or: [
        {
          senderId: req.user._id,
          receiverId: chatedUserId,
        },
        {
          senderId: chatedUserId,
          receiverId: req.user._id,
        },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum + 1);

  const hasNextPage = messages.length > limitNum;
  console.log("SSSS", messages);
  if (hasNextPage) messages.pop();
  messages.reverse();

  return [messages, hasNextPage];
};

module.exports.deleteMessage = async function (req) {
  try {
    const { _id } = req.body;

    if (!_id) throw new Error("No message id found in delete msg route!");
    const msg = await messageModel.findByIdAndDelete(_id);

    return ["Success"];
  } catch (err) {
    return err;
  }
};
