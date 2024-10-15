const Chat = require("../models/chatModel");

exports.sendMessage = async (request) => {
  const { sender_id, recipient_id, content } = request;

  let chat = await Chat.findOne({
    participants: { $all: [sender_id, recipient_id] },
  });

  if (!chat) {
    chat = new Chat({
      participants: [sender_id, recipient_id],
      messages: [],
    });
  }

  chat.messages.push({
    sender: sender_id,
    content: content,
  });

  await chat.save();

  return { success: true, message: "Message sent successfully" };
};

exports.getMessages = async (request) => {
  const { user_id, other_user_id } = request;

  const chat = await Chat.findOne({
    participants: { $all: [user_id, other_user_id] },
  });

  if (!chat) {
    return { messages: [] };
  }

  return {
    messages: chat.messages.map((msg) => ({
      sender_id: msg.sender.toString(),
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    })),
  };
};
