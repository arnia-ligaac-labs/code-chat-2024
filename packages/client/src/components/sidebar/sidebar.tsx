import { IConversation } from "@code-chat-2024/types";
import { X, Plus } from "react-feather";

interface ISidebarProps {
  addConversation: () => void;
  className?: string;
  conversations: IConversation[];
  removeConversation: (conversationId: string) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (conversationId: string | null) => void;
}

export default function Sidebar({
  addConversation,
  className,
  conversations,
  removeConversation,
  selectedConversationId,
  setSelectedConversationId
}: ISidebarProps) {
  return (
    <div
      className={`p-4 flex flex-col gap-4 h-screen overflow-y-auto ${className}`}
    >
      <button
        className="p-2 border text-white justify-center flex"
        onClick={addConversation}
      >
        <Plus />
      </button>
      {conversations.map(conversation => (
        <div
          key={conversation.id}
          className={`p-2 rounded-xl grid grid-cols-12 gap-4 curso-pointer ${
            selectedConversationId === conversation.id
              ? "bg-gray-100 text-black"
              : "text-white"
          }`}
          onClick={() => setSelectedConversationId(conversation.id)}
          tabIndex={0}
          role="button"
        >
          <p className="text-ellipsis overflow-hidden col-span-10">
            {conversation.id}
          </p>
          <button
            className="col-span-2 flex justify-center items-center"
            onClick={() => removeConversation(conversation.id)}
          >
            <X />
          </button>
        </div>
      ))}
    </div>
  );
}
