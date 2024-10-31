const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mongoose = require("mongoose");
const path = require("path");
const config = require("./config");
const chatController = require("./controllers/chatController");
const logger = require("./utils/logger");

const PROTO_PATH = path.resolve(__dirname, "protos/chat.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

const server = new grpc.Server();

server.addService(chatProto.ChatService.service, {
  sendMessage: chatController.sendMessage,
  getMessages: chatController.getMessages,
});

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
    server.bindAsync(
      `0.0.0.0:${config.PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          logger.error("Failed to bind server:", error);
          return;
        }
        logger.info(`Server running at http://0.0.0.0:${port}`);
        server.start();
      }
    );
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error);
  });
