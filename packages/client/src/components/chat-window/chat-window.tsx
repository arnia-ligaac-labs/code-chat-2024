// shows a list of message based on internal message state
// has a method to add new messages
// simulates replies to messages (useEffect + setTimeout)
// has a child component that holds the text input & button to add new messages

import IConversation from "@/models/IConversation";

interface ChatWindowProps {
    conversation: IConversation;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
    return null;
}
