// chatService.js
const { status } = require("@grpc/grpc-js");
const Chat = require("../models/chatModel");
const logger = require("../utils/logger");

exports.sendMessage = async ({ sender_id, recipient_id, content }) => {
  console.log(sender_id, recipient_id, content);
  try {
    // Find existing chat or create new one
    let chat = await Chat.findOne({
      participants: { $all: [sender_id, recipient_id] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [sender_id, recipient_id],
        messages: [],
      });
    }

    // Add new message
    chat.messages.push({
      sender: sender_id,
      content: content,
    });

    await chat.save();

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.log(error);
    logger.error("Error in sendMessage:", error);
    throw {
      code: status.INTERNAL,
      message: "Failed to send message",
    };
  }
};

exports.getMessages = async ({ user_id, other_user_id }) => {
  try {
    const chat = await Chat.findOne({
      participants: { $all: [user_id, other_user_id] },
    });

    if (!chat) {
      return { messages: [] };
    }

    // Map messages without populating user data
    const messages = chat.messages.map((msg) => ({
      sender_id: msg.sender.toString(), // Convert ObjectId to string
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    }));

    return { messages };
  } catch (error) {
    console.log(error);
    logger.error("Error in getMessages:", error);
    throw {
      code: status.INTERNAL,
      message: "Failed to retrieve messages",
    };
  }
};
