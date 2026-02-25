import { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { useSelector } from "react-redux";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { socket } = useSelector((state) => state.userSlice);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // 🔹 Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔹 Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!socket || !input.trim()) return;

    setLoading(true);

    socket.emit("message", input);

    setMessages((prev) => [
      ...prev,
      { type: "user", text: input },
    ]);

    setInput("");
  };

  // 🔹 Listen AI response (ONLY ONCE)
  useEffect(() => {
    if (!socket) return;

    const handleResponse = (data) => {
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        { type: "ai", text: data },
      ]);
    };

    socket.on("response", handleResponse);

    return () => {
      socket.off("response", handleResponse);
    };
  }, [socket]);

  return (
    <div>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition flex items-center gap-2"
        >
          <HiSparkles size={20} />
          <FiMessageSquare size={20} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiSparkles size={20} />
              <h3 className="font-semibold">AI Shopping Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 p-1 rounded"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    msg.type === "ai"
                      ? "bg-blue-500 text-white animate-fadeIn"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Animation */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 px-4 py-2 rounded-lg flex gap-1">
                  <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t p-4 flex gap-2 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 transition"
            >
              <FiSend size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;