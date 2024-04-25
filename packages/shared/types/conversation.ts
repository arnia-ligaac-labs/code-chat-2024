import { IMessage } from "./message";

export interface IConversation {
    id: string;
    name: string;
    messages: IMessage[];
}