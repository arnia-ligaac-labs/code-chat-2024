import { IStorage } from ".";
import { v4 as uuidv4 } from "uuid";
import { TConversation, TMessage } from "../interfaces";

const database: TMessage[] = [];

export class InMemoryStorage implements IStorage {
  public async save(message: string) {
    const payload: TMessage = {
      id: uuidv4(),
      message,
      timestamp: new Date().toISOString(),
    };
    database.push(payload);
  }

  public async getAll() {
    return database;
  }

  public async getConversations(userId: string): Promise<TConversation[]> {
      return [] as TConversation[];
  }

  public async createConversation(userId: string): Promise<void> {
      return;
  }

  public async saveMessage(userId: string, conversationId: string, message: string): Promise<void> {
      return;
  }

  public async getMessages(userId: string, conversationId: string): Promise<TMessage[]> {
      return [] as TMessage[];
  }
}
