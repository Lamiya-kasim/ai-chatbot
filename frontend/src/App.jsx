import { useState } from "react";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    // 1. Immediately show the user's message (optimistic UI update)
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // 2. Call our FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      // 3. Add the AI's reply once it arrives
      const aiMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat request failed:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-2xl mx-auto bg-white">
      <header className="p-4 border-b text-lg font-semibold">
        Local AI Chatbot
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="text-gray-400 text-sm italic">AI is typing...</div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}

export default App;