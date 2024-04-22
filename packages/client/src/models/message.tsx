import MessageOriginator from "@/models/message-originator";

interface IMessage {
    id: string;
    text: string | null;
    origin: MessageOriginator;
}

export default IMessage;
