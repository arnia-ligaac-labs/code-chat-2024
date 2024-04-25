import { ESender, IConversation } from "@code-chat-2024/types";
import { useEffect, useRef, useState } from "react";
import { Send } from "react-feather";

export interface IChatWindowProps {
  addMessage: (
    conversationId: string,
    content: string,
    sender: ESender
  ) => void;
  className?: string;
  conversation?: IConversation;
}

export default function ChatWindow({
  addMessage,
  className,
  conversation
}: IChatWindowProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleAddMessage = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!conversation) return;
    addMessage(conversation.id, message, ESender.User);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  if (!conversation) return null;

  return (
    <div className={`grid grid-rows-12 h-screen p-4 ${className}`}>
      <div className="row-span-11 flex flex-col p-4 gap-4 overflow-y-auto">
        {conversation.messages.map(message => (
          <p
            key={message.id}
            className={`p-4 border rounded-xl max-w-[66%] ${
              message.sender === ESender.User
                ? "ml-auto text-right"
                : "mr-auto text-left bg-gray-200 text-black"
            }`}
          >
            {message.content}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="row-span-1 flex relative text-black bg-white">
        <input
          type="text"
          className="grow border p-4 pr-12"
          placeholder="Type a message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          className="p-2 text-black absolute right-0 top-0 bottom-0 shadow-xl"
          onClick={handleAddMessage}
          type="submit"
        >
          <Send />
        </button>
      </form>
    </div>
  );
}
