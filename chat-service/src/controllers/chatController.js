const chatService = require("../services/chatService");

exports.sendMessage = async (call, callback) => {
  try {
    const result = await chatService.sendMessage(call.request);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
};

exports.getMessages = async (call, callback) => {
  try {
    const result = await chatService.getMessages(call.request);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
};
