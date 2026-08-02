const express = require("express");
const isLoggedIn = require("../../../../middlewares/isLoggedIn");
const apiRouteResFormate = require("../../../../utils/ApiRoute");
const {
  getMessages,
  deleteMessage,
} = require("../../../../controller/app/message");
const router = express.Router();

router.get("/", isLoggedIn, apiRouteResFormate(getMessages));

router.delete("/", isLoggedIn, apiRouteResFormate(deleteMessage));

module.exports = router;
