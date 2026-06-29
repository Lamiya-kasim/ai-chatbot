import { useState } from "react";

function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return; // ignore empty sends
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-blue-600 text-white px-5 py-2 rounded-full disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;