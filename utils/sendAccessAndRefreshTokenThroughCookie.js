const { generateRefreshToken } = require("./generateToken");
const { generateAccessToken } = require("./generateToken");

function sendAccessAndRefreshTokenThroughCookies(userEmail, res) {
  const accessToken = generateAccessToken(userEmail);
  const refreshToken = generateRefreshToken(userEmail);

  console.log("trhis my access torekn", accessToken);
  console.log("trhis my refresh torekn", refreshToken);

  // Check if we are running in production on Vercel
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    // Must be true in production for 'none' to work. False on localhost (HTTP).
    secure: isProduction,
    // Must be lowercase string 'none' for cross-site Vercel domains. 'lax' for local testing.
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 min cookie age
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 * 5, // 5 days
  });
}

module.exports = sendAccessAndRefreshTokenThroughCookies;
