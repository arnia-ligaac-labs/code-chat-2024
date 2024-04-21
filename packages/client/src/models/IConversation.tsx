import IMessage from "@/models/IMessage";

interface IConversation {
    id: string;
    messages: IMessage[];
}

export default IConversation
