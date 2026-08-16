const apiResponse = require("../utils/apiResponse");
const {
  APiResponseSuccess,
  ApiResponseError,
} = require("../utils/apiResponse");
const sendAccessAndRefreshTokenThroughCookies = require("./sendAccessAndRefreshTokenThroughCookie");

const authPaths = ["/login", "/signup", "/verify-otp"];
const isLogout = ["/logout"];
const apiRouteResFormate = (fn) => async (req, res) => {
  try {
    const data = await fn(req, res);
    if (!data) {
      ApiResponseError(res, "Server Error!", "Error", 304);
      return;
    }

    if (authPaths.includes(req.url) && data[0]?.email) {
      sendAccessAndRefreshTokenThroughCookies(data[0].email, res);
    } else if (isLogout.includes(req.url)) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
    }
    APiResponseSuccess(res, data, "Success", 200);
  } catch (err) {
    console.log(err.message, err.status);
    ApiResponseError(res, err.message, "Error", err.status);
  }
};

module.exports = apiRouteResFormate;
