import { IStorage } from ".";
import { v4 as uuidv4 } from "uuid";
import { TMessage } from "../interfaces";

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
}
