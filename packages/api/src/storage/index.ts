import { MemoryClass } from "../constants";
import { TMessage } from "../interfaces";
import { DynamoStorage } from "./DynamoStorage";
import { InMemoryStorage } from "./InMemoryStorage";
import { SqlStorage } from "./SqlStorage";

export interface IStorage {
  save(message: string): Promise<void>;
  getAll(): Promise<TMessage[]>;
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

  public save(message: string) {
    return this.storage.save(message);
  }

  public getAll() {
    return this.storage.getAll();
  }
}
