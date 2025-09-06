import { useState, useEffect } from "react";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Fetch old chats from backend
  useEffect(() => {
    fetch("http://localhost:5000/messages")
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    const res = await fetch("http://localhost:5000/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const botReply = await res.json();
    setMessages(prev => [...prev, { sender: "bot", text: botReply.reply }]);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-3">💬 Chatbot</h1>
        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-xs ${
                m.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-black self-start mr-auto"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
