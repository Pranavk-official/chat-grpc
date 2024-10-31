import React, { useState, useEffect, useCallback, useRef } from "react";
import { getChatMessages, sendChatMessage } from "../services/chatService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const mounted = useRef(false);

  console.log(messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    if (!selectedUsername) return;

    try {
      const response = await getChatMessages({
        username: user.username,
        recipient_username: selectedUsername,
      });

      if (mounted.current) {
        setMessages(response.messages || []);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      if (mounted.current) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to fetch messages. Please try again.");
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [selectedUsername, user.username]);

  useEffect(() => {
    mounted.current = true;

    if (selectedUsername) {
      fetchMessages();
      // Set up polling for new messages
      const interval = setInterval(fetchMessages, 50000);
      return () => clearInterval(interval);
    }

    return () => {
      mounted.current = false;
    };
  }, [fetchMessages, selectedUsername]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedUsername) {
      toast.error("Please select a recipient and enter a message");
      return;
    }

    setIsSending(true);
    try {
      await sendChatMessage({
        sender_username: user.username,
        recipient_username: selectedUsername,
        content: newMessage.trim(),
      });

      setNewMessage("");
      await fetchMessages();
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  if (!selectedUsername) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Start a Chat
          </h2>
          <input
            type="text"
            placeholder="Enter recipient's username"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={username}
            onChange={handleUsernameChange}
          />
          <button
            onClick={() => setSelectedUsername(username)}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Start Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-white shadow px-4 py-3 flex items-center">
        <span className="text-lg font-semibold text-gray-800">
          Chat with {selectedUsername}
        </span>
        <button
          onClick={() => setSelectedUsername("")}
          className="ml-auto text-gray-600 hover:text-gray-800"
        >
          Change Recipient
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender_id === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender_id === user.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="break-words">{message.content}</p>
                <span
                  className={`text-xs ${
                    message.sender_id === user.id
                      ? "text-indigo-200"
                      : "text-gray-500"
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isSending}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSending}
          >
            {isSending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
