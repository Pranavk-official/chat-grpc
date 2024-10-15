require("dotenv").config();

module.exports = {
  port: process.env.PORT || 50051,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};
