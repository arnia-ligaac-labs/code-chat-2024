import { ESender } from "./sender";

export interface IMessage {
    id: string;
    content: string;
    sender: ESender;
}
