import { TMessage } from "../interfaces";
import { Storage } from "../storage";

export class MessageService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
  }

  public saveMessage(
    userId: string,
    conversationId: string,
    message: string
  ): Promise<void> {
    return this.storage.saveMessage(userId, conversationId, message);
  }

  public getMessages(
    userId: string,
    conversationId: string
  ): Promise<TMessage[]> {
    return this.storage.getMessages(userId, conversationId);
  }
}
