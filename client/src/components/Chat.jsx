import React, { useState, useEffect } from "react";
import { getChatMessages, sendChatMessage } from "../services/chatService";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const fetchedMessages = await getChatMessages();
    setMessages(fetchedMessages);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendChatMessage(newMessage);
    setNewMessage("");
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="bg-white rounded-lg p-3 shadow">
            <p className="text-gray-800">{message.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="bg-white p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
