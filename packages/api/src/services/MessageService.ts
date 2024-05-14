import { TMessage } from "../interfaces";
import { Storage } from "../storage";

export class MessageService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
  }

  public save(message: string) {
    return this.storage.save(message);
  }

  public getAll() {
    return this.storage.getAll();
  }
}
