require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/chat_db",
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || "localhost:3000",
};
