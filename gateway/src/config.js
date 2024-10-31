require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  chatServiceUrl: process.env.CHAT_SERVICE_URL || "localhost:50051",
  userServiceUrl: process.env.USER_SERVICE_URL || "localhost:50052",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_here",
};
