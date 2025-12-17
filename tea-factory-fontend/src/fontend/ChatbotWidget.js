import React, { useState } from "react";
import axios from "axios";
import { FaCommentDots, FaSeedling } from "react-icons/fa";


const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I help you?" }]);
  const [input, setInput] = useState("");

  const base = process.env.REACT_APP_API_URL || "http://127.0.0.1:3001";

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post(`${base}/api/chatbot/ask`, { message: input });
      if (res.data.success) {
        setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
      }
    } catch (err) {
      setMessages([...newMessages, { sender: "bot", text: "⚠️ Error: Could not reach server" }]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen ? (
        <button
          className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white flex items-center justify-center ring-2 ring-emerald-300/40 hover:from-emerald-700 hover:to-green-700 transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
          onClick={() => setIsOpen(true)}
          aria-label="Open chatbot"
        >
          <FaCommentDots className="text-xl" />

        </button>
      ) : (
        <div className="w-96 max-w-[90vw] max-h-[70vh] bg-white/95 backdrop-blur border border-gray-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center"><FaSeedling size={22} /></div>
              <div className="text-sm">
                <div className="font-semibold leading-4">Tea Factory Chatbot</div>
                <div className="text-white/80 text-[11px]">Online • Typically replies instantly</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close chatbot"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gradient-to-b from-white to-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`${
                    msg.sender === 'user'
                      ? 'bg-emerald-100 text-emerald-900 rounded-2xl rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                  } px-3 py-2 max-w-[80%] leading-relaxed shadow-sm`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t bg-white px-3 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
