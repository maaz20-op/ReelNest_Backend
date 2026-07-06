const apiResponse = require("../utils/apiResponse");
const {
  APiResponseSuccess,
  ApiResponseError,
} = require("../utils/apiResponse");
const sendAccessAndRefreshTokenThroughCookies = require("./sendAccessAndRefreshTokenThroughCookie");

const authPaths = ["/login"];
const apiRouteResFormate = (fn) => async (req, res) => {
  try {
    const data = await fn(req);
    if (!data) {
      ApiResponseError(res, "No Data Found!", "Error", 304);
      return;
    }

    if (authPaths.includes(req.url)) {
      sendAccessAndRefreshTokenThroughCookies(data[0].email, res);
    }

    APiResponseSuccess(res, data, "Success", 200);
  } catch (err) {
    console.log("api route error", err);
    ApiResponseError(res, err, "Error", 500);
  }
};

module.exports = apiRouteResFormate;
