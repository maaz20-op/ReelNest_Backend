const { generateRefreshToken } = require("./generateToken");
const { generateAccessToken } = require("./generateToken");

function sendAccessAndRefreshTokenThroughCookies(userEmail, res) {
  const accessToken = generateAccessToken(userEmail);
  const refreshToken = generateRefreshToken(userEmail);

  // Check if we are running in production on Vercel/Railway
  const isProduction = process.env.NODE_ENV === "production";

  res.setHeader("Set-Cookie", [
    `accessToken=${accessToken}; Max-Age=${15 * 60}; Path=/; HttpOnly; Secure; SameSite=None`,
    `refreshToken=${refreshToken}; Max-Age=${24 * 60 * 60 * 5}; Path=/; HttpOnly; Secure; SameSite=None`,
  ]);
}

module.exports = sendAccessAndRefreshTokenThroughCookies;
