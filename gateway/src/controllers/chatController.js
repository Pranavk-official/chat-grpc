const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const config = require("../config");
const logger = require("../utils/logger");

const PROTO_PATH = path.resolve(
  __dirname,
  "../../chat-service/src/protos/chat.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

const client = new chatProto.ChatService(
  config.chatServiceUrl,
  grpc.credentials.createInsecure()
);

exports.sendMessage = (req, res) => {
  const { userId, message } = req.body;

  client.SendMessage({ userId, message }, (error, response) => {
    if (error) {
      logger.error("Error sending message:", error);
      return res.status(500).json({ error: "Failed to send message" });
    }
    res.json(response);
  });
};

exports.getMessages = (req, res) => {
  const { userId } = req.params;

  client.GetMessages({ userId }, (error, response) => {
    if (error) {
      logger.error("Error getting messages:", error);
      return res.status(500).json({ error: "Failed to get messages" });
    }
    res.json(response);
  });
};
