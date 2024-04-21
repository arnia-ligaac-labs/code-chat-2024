// shows a list of chips based on the number of conversations
// has a button to add new conversations
// has a button to set the active conversation
// the active conversation is highlighted

import IConversation from "@/models/IConversation";

interface SidebarProps {
    createNewConversation: () => void;
    conversations: IConversation[];
    setCurrentConversation: (conversation: IConversation) => void;
}

export default function Sidebar({ setCurrentConversation, createNewConversation, conversations }: SidebarProps) {
    return null;
}
