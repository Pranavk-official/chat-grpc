// chatController.js (Gateway)
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const config = require("../config");
const logger = require("../utils/logger");

// Load both chat and user protos
const CHAT_PROTO_PATH = path.resolve(__dirname, "../protos/chat.proto");
const USER_PROTO_PATH = path.resolve(__dirname, "../protos/user.proto");

const chatPackageDefinition = protoLoader.loadSync(CHAT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const chatProto = grpc.loadPackageDefinition(chatPackageDefinition).chat;
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

// Create clients for both services
const chatClient = new chatProto.ChatService(
  config.chatServiceUrl,
  grpc.credentials.createInsecure()
);

const userClient = new userProto.UserService(
  config.userServiceUrl,
  grpc.credentials.createInsecure()
);

// Helper function to handle gRPC calls
const makeGrpcCall = (client, method, data) => {
  return new Promise((resolve, reject) => {
    client[method](data, (error, response) => {
      if (error) {
        console.log(error);
        logger.error(`Error in ${method}:`, error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

// Helper function to get user details
const getUserDetails = async (username) => {
  try {
    const response = await makeGrpcCall(userClient, "GetUser", {
      username: username,
    });
    return response.user;
  } catch (error) {
    logger.error(`Failed to get user details for ${username}:`, error);
    throw new Error(`User not found: ${username}`);
  }
};

exports.sendMessage = async (req, res) => {
  const { sender_username, recipient_username, content } = req.body;

  try {
    // Verify both users exist and get their details
    const [sender, recipient] = await Promise.all([
      getUserDetails(sender_username),
      getUserDetails(recipient_username),
    ]);

    if (!sender || !recipient) {
      throw new Error("One or both users not found");
    }

    logger.info(
      `Sending message from ${sender.username} to ${recipient.username}`
    );

    const response = await makeGrpcCall(chatClient, "SendMessage", {
      sender_id: sender.id,
      recipient_id: recipient.id,
      content,
    });

    res.json({
      ...response,
      sender: {
        id: sender.id,
        username: sender.username,
      },
      recipient: {
        id: recipient.id,
        username: recipient.username,
      },
    });
  } catch (error) {
    logger.error("Error in sendMessage:", error);
    const statusCode = error.code === grpc.status.INTERNAL ? 500 : 400;
    res.status(statusCode).json({
      error: error.message || "Failed to send message",
      details: error.details,
    });
  }
};
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const other_user_id = userId;
  const user_id = req.user.username;

  console.log(req.user);

  try {
    // Verify both users exist
    const [currentUser, otherUser] = await Promise.all([
      getUserDetails(user_id),
      getUserDetails(other_user_id),
    ]);

    if (!currentUser || !otherUser) {
      throw new Error("One or both users not found");
    }

    const response = await makeGrpcCall(chatClient, "GetMessages", {
      user_id: currentUser.id,
      other_user_id: otherUser.id,
    });

    // Enrich messages with user details
    const enrichedMessages = response.messages.map((msg) => ({
      ...msg,
      sender:
        msg.sender_id === currentUser.id
          ? {
              id: currentUser.id,
              username: currentUser.username,
            }
          : {
              id: otherUser.id,
              username: otherUser.username,
            },
    }));

    res.json({
      messages: enrichedMessages,
      users: {
        current: {
          id: currentUser.id,
          username: currentUser.username,
        },
        other: {
          id: otherUser.id,
          username: otherUser.username,
        },
      },
    });
  } catch (error) {
    logger.error("Error in getMessages:", error);
    const statusCode = error.code === grpc.status.INTERNAL ? 500 : 400;
    res.status(statusCode).json({
      error: error.message || "Failed to get messages",
      details: error.details,
    });
  }
};
