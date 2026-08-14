import { useState, useEffect } from "react";
import axios from "axios";

function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const patientId = user?._id;

  useEffect(() => {
    loadChatHistory();
  }, []);

  // Load previous chats
  const loadChatHistory = async () => {
    if (!patientId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/history/${patientId}`
      );

      const formattedChats = response.data.chats.map((chat) => ({
        role: chat.role,
        text: chat.message,
      }));

      setMessages(formattedChats);
    } catch (error) {
      console.error(error);
    }
  };

  // Send Message
  const sendMessage = async () => {
    if (!patientId) {
      alert("Please login again.");
      return;
    }

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/chat/send",
        {
          patientId,
          message: currentMessage,
        }
      );

      const aiMessage = {
        role: "assistant",
        text: response.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to contact AI."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl">

        <div className="bg-blue-600 text-white p-5 rounded-t-xl">
          <h1 className="text-3xl font-bold">
            🤖 HealthFlow AI Assistant
          </h1>

          <p className="mt-2 text-blue-100">
            Ask health-related questions, understand your reports,
            prescriptions, and get AI-powered guidance.
          </p>
        </div>

        <div className="h-[500px] overflow-y-auto p-6 space-y-4">

          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              👋 Welcome!
              <br />
              Start chatting with HealthFlow AI.
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-200 p-4 rounded-xl w-fit">
              🤖 Thinking...
            </div>
          )}

        </div>

        <div className="border-t p-5 flex gap-3">

          <input
            type="text"
            placeholder="Ask HealthFlow AI..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="flex-1 border rounded-lg p-3"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 rounded-lg"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AIChat;