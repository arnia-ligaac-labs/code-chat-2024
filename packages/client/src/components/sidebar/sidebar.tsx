// shows a list of chips based on the number of conversations
// has a button to add new conversations
// has a button to set the active conversation
// the active conversation is highlighted

import IConversation from "@/models/conversation";
import Chip from "@/components/sidebar/chip";

interface SidebarProps {
    createNewConversation: () => void;
    conversations: IConversation[];
    setCurrentConversation: (conversationID: string) => void;
    currentConversationID: string | null;
}

export default function Sidebar({ setCurrentConversation, createNewConversation, conversations, currentConversationID }: SidebarProps) {
    const items = conversations.map((conversation: IConversation) => {
        return (
            <li key={conversation.id}>
                <Chip
                    title={conversation.id}
                    isSelected={currentConversationID != null && currentConversationID === conversation.id}
                    updateCurrentConversation={() => setCurrentConversation(conversation.id)}
                />
            </li>
        )
    })
    return (
        <div className="flex flex-col w-full">
            <div className="mr-2 m-2 p-2 rounded-l select-none hover:bg-gray-200" onClick={createNewConversation}>
                <div className="flex flex-row items-center justify-center">
                    <div className="flex m-2 text-xl font-sans">+{/* TODO: Replace this + symbol with an icon */}</div>
                    <div className="flex m-2">New conversation</div>
                </div>
            </div>
            <hr className="mx-2 h-0.5 border-t-0 bg-gray-400" />
            <ul>
                {items}
            </ul>
        </div>
    );
}
