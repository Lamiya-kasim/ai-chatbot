function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-200 text-gray-900 rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default MessageBubble;