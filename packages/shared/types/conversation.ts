import { IMessage } from "./message";

export interface IConversation {
    id: string;
    messages: IMessage[];
}