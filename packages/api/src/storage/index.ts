import { MemoryClass } from "../constants";
import { TConversation, TMessage } from "../interfaces";
import { DynamoStorage } from "./DynamoStorage";
import { InMemoryStorage } from "./InMemoryStorage";
import { SqlStorage } from "./SqlStorage";

export interface IStorage {
  createConversation(userId: string) : Promise<void>;
  getConversations(userId: string): Promise<TConversation[]>;
  saveMessage(userId: string, conversationId: string, message: string): Promise<void>; //TODO: should a reply to the message
  getMessages(userId: string, conversationId: string): Promise<TMessage[]>;
}

export class Storage implements IStorage {
  private storage: IStorage;

  constructor() {
    if (process.env.APP_MEMORY_CLASS === MemoryClass.InMemory) {
      this.storage = new InMemoryStorage();
    } else if (process.env.APP_MEMORY_CLASS === MemoryClass.Sql) {
      this.storage = new SqlStorage();
    } else if (process.env.APP_MEMORY_CLASS === MemoryClass.Dynamo) {
      this.storage = new DynamoStorage();
    } else {
      throw Error("Unkown memory class");
    }
  }

  public createConversation(userId: string) {
    return this.storage.createConversation(userId);
  }

  public getConversations(userId: string) {
    return this.storage.getConversations(userId);
  }

  public saveMessage(userId: string, conversationId: string, message: string) {
    return this.storage.saveMessage(userId, conversationId, message);
  }

  public getMessages(userId: string, conversationId: string) {
    return this.storage.getMessages(userId, conversationId);
  }
}
