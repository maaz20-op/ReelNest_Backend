const { generateRefreshToken } = require("./generateToken");
const { generateAccessToken } = require("./generateToken");

function sendAccessAndRefreshTokenThroughCookies(userEmail, res) {
  const accessToken = generateAccessToken(userEmail);
  const refreshToken = generateRefreshToken(userEmail);
  console.log("trhis my access torekn", accessToken);
  console.log("trhis my refresh torekn", refreshToken);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true, // Must be true for SameSite=None to work
    sameSite: "None", // only HTTPS in productioin // or "Strict" to prevent csrf attack it may not send cookie from unauthorized website
    maxAge: 15 * 60 * 1000, // 15 min cookie age to live in browser
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Must be true for SameSite=None to work
    sameSite: "None", // only HTTPS in prod // or "Strict" / "None" based on frontend-backend location
    maxAge: 24 * 60 * 60 * 1000 * 5, // 5 day in m
  });
}

module.exports = sendAccessAndRefreshTokenThroughCookies;
