import { TConversation } from "../interfaces";
import { Storage } from "../storage";

export class ConversationService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
  }

  public saveConversation(userId: string): Promise<void> {
    return this.storage.createConversation(userId);
  }

  public getConversations(userId: string): Promise<TConversation[]> {
    return this.storage.getConversations(userId);
  }
}
