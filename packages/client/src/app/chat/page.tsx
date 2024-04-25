"use client";
import ChatWindow from "@/components/chat-window";
import Sidebar from "@/components/sidebar";
import useConversations from "@/hooks/use-conversations";

export default function Chat() {
  const {
    addConversation,
    addMessage,
    conversations,
    removeConversation,
    selectedConversation,
    selectedConversationId,
    setSelectedConversationId
  } = useConversations();
  return (
    <div className="grid grid-cols-12 h-screen">
      <Sidebar
        addConversation={addConversation}
        conversations={conversations}
        removeConversation={removeConversation}
        selectedConversationId={selectedConversationId}
        setSelectedConversationId={setSelectedConversationId}
        className="col-span-3 border-r"
      />
      <ChatWindow
        addMessage={addMessage}
        conversation={selectedConversation}
        className="col-span-9"
      />
    </div>
  );
}
