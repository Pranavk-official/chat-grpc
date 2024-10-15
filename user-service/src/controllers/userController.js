const userService = require("../services/userService");
const logger = require("../utils/logger");

exports.register = async (call, callback) => {
  try {
    const { username, password } = call.request;
    const user = await userService.register(username, password);
    callback(null, { user });
  } catch (error) {
    logger.error("Error in register controller:", error);
    callback(error);
  }
};

exports.login = async (call, callback) => {
  try {
    const { username, password } = call.request;
    const token = await userService.login(username, password);
    callback(null, { token });
  } catch (error) {
    logger.error("Error in login controller:", error);
    callback(error);
  }
};

exports.getUser = async (call, callback) => {
  try {
    const { userId } = call.request;
    const user = await userService.getUser(userId);
    callback(null, { user });
  } catch (error) {
    logger.error("Error in getUser controller:", error);
    callback(error);
  }
};
