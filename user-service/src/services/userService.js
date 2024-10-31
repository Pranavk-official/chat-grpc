const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("../config");
const logger = require("../utils/logger");

exports.register = async (username, email, password) => {
  try {
    const user = new User({ username, email, password });
    await user.save();
    return { id: user._id, username: user.username };
  } catch (error) {
    logger.error("Error in register service:", error);
    throw error;
  }
};

exports.login = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid username or password");
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      config.jwtSecret,
      {
        expiresIn: "1h",
      }
    );
    return { token, user };
  } catch (error) {
    logger.error("Error in login service:", error);
    throw error;
  }
};

exports.getUser = async (username) => {
  try {
    const user = await User.findOne({ username: username.trim() });
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }
    return { id: user._id, username: user.username };
  } catch (error) {
    logger.error("Error in getUser service:", error);
    throw error;
  }
};
