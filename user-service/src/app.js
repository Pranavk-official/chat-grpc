const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mongoose = require("mongoose");
const config = require("./config");
const userController = require("./controllers/userController");
const logger = require("./utils/logger");

const packageDefinition = protoLoader.loadSync("./src/protos/user.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB");

    const server = new grpc.Server();
    server.addService(userProto.UserService.service, {
      register: userController.register,
      login: userController.login,
      getUser: userController.getUser,
    });

    server.bindAsync(
      `0.0.0.0:${config.port}`,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          logger.error("Failed to bind server:", error);
          return;
        }
        server.start();
        logger.info(`Server running at http://0.0.0.0:${port}`);
      }
    );
  } catch (error) {
    logger.error("Failed to start server:", error);
  }
};

startServer();
