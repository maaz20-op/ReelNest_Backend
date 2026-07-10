const userModel = require("../../models/user-model");
const postModel = require("../../models/post-model");
const pinModel = require("../../models/pin-model");

module.exports.savePin = async function (req) {
  const userId = req?.user?._id;
  try {
    let user = await userModel.findById(userId);

    if (!user) throw new Error("user not found");

    let { postId } = req.body;

    let existingPin = await pinModel.findOne({
      savedPost: postId,
      createdBy: user?._id,
    });

    if (existingPin) {
      if (
        user.pins.some((id) => id.toString() === existingPin._id.toString())
      ) {
        throw new Error("You PIned Image Already Saved!");
      }

      user.pins.push(existingPin._id);
      await user.save();
    }

    let pin = await pinModel.create({
      savedPost: postId,
      createdBy: user._id,
    });

    console.log("this is pin", pin);

    user.pins.push(pin._id);
    await user.save();
    let array = [pin];
    return array;
  } catch (err) {
    throw err;
  }
};

module.exports.deletePin = async function (req) {
  try {
    let deletedPin = await pinModel.findByIdAndDelete(req.params.id);

    if (!deletedPin) {
      throw new Error("error", "Unable to delete your Pin");
    }

    let userDeletedPin = await userModel.updateOne(
      { _id: req.user._id },
      { $pull: { pins: deletedPin._id } },
    );

    return [userDeletedPin, deletedPin];
  } catch (err) {
    throw err;
  }
};

module.exports.getSavedVideoPosts = async function (req) {
  const userId = req?.user?._id;
  try {
    if (!userId) throw new Error("No userId Found");

    const pins = await pinModel
      .find({
        createdBy: userId,
      })
      .populate("savedPost")
      .select("-_id savedPost");

    const newPins = [];

    pins.forEach((post) => {
      newPins.push(post?.savedPost);
    });

    return [newPins];
  } catch (err) {
    throw err;
  }
};

module.exports.getSavedImagePosts = async function (req) {
  const userId = req?.user?._id;
  try {
    if (!userId) throw new Error("No userId Found");

    const pins = await pinModel.aggregate([
      {
        $match: {
          createdBy: userId,
          mediaType: "image",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "savedPost",
          foreignField: "_id",
          as: "savedPostdData",
        },
      },
      {
        $project: {
          savedPostData: 1,
        },
      },
    ]);

    console.log(pins);
    const newPins = [];

    pins.forEach((post) => {
      newPins.push(post?.savedPostData);
    });

    return [newPins];
  } catch (err) {
    throw err;
  }
};
