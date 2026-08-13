const userModel = require("../../models/user-model");
const addLoginEmailToQueue = require("../../queues/emailQueue");
const sendAccessAndRefreshTokenThroughCookies = require("../../utils/sendAccessAndRefreshTokenThroughCookie");

// authentication using googleCallboogle passport strategy

module.exports.googleCallback = async (req, res) => {
  try {
    let userEmail = req.user;
    console.log("REQUESTED USER:", userEmail);

    if (!userEmail) {
      console.log("❌ Google Login Failed: req.user missing");
      return res.redirect("https://reel-nest-frontend.vercel.app/login");
    }

    let user = await userModel.findOne({ email: userEmail });

    if (!user) {
      console.log("❌ Failed to Login: User not in database");
      return res.redirect("https://reel-nest-frontend.vercel.app/login");
    }

    sendAccessAndRefreshTokenThroughCookies(user.email, res);

    const userString = encodeURIComponent(JSON.stringify(user));

    return res.redirect(
      `https://reel-nest-frontend.vercel.app/google-callback?user=${userString}`,
    );
  } catch (err) {
    console.error("❌ Catch Error in Google Callback:", err.message);

    if (res.headersSent) {
      console.log("Response already completed. Preventing duplicate redirect.");
      return;
    }

    return res.redirect("https://reel-nest-frontend.vercel.app/login");
  }
};

module.exports.googleConfigCallback = async function (
  accessToken,
  refreshToken,
  profile,
  done,
) {
  try {
    let userEmail = profile.emails[0].value;
    done(null, userEmail);
  } catch (err) {
    done(err, false);
  }
};
