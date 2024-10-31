const userService = require("../services/userService");
const logger = require("../utils/logger");

exports.register = async (call, callback) => {
  try {
    console.log(call.request);
    const { username, email, password } = call.request;
    const user = await userService.register(username, email, password);
    callback(null, { user });
  } catch (error) {
    logger.error("Error in register controller:", error);
    callback(error);
  }
};

exports.login = async (call, callback) => {
  try {
    console.log(call.request);
    const { username, password } = call.request;
    const { token, user } = await userService.login(username, password);
    console.log(token, user);
    callback(null, {
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    logger.error("Error in login controller:", error);
    callback(error);
  }
};

exports.getUser = async (call, callback) => {
  try {
    const { username } = call.request;
    const user = await userService.getUser(username);
    callback(null, { user });
  } catch (error) {
    logger.error("Error in getUser controller:", error);
    callback(error);
  }
};
