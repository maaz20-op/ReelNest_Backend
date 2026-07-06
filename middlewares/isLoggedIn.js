const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

const isLoggedIn = async function (req, res, next) {
  try {
    let jwtAccessToken = req.cookies.accessToken;
    let jwtRefreshToken = req.cookies.refreshToken;

    if (!jwtRefreshToken)
      return console.log("gand mat marwoa", jwtRefreshToken);
    let decodedData = jwt.verify(
      jwtRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (!decodedData.email) return console.log("no data");
    let backupUser = await userModel.findOne({ email: decodedData.email });

    if (!jwtAccessToken && jwtRefreshToken) {
      req.session.backupUser = backupUser;
      let requestURL = req.originalUrl;
      req.session.requestURL = requestURL;
      return res.redirect("/auth/local/getAccessToken");
    }

    const decoded = jwt.verify(jwtAccessToken, process.env.ACCESS_TOKEN_SECRET);
    let user = await userModel.findOne({
      email: decoded.email,
    });
    if (!user) return console.log("no user 2");

    req.user = user;

    return next();
  } catch (err) {
    return console.log(err);
  }
};

module.exports = isLoggedIn;
