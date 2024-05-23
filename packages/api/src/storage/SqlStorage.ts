import { IStorage } from ".";
import { RowDataPacket, createConnection, Connection } from "mysql2/promise";
import { TConversation, TMessage } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

interface IMySQLEntry extends RowDataPacket {
  id: string;
  message: string;
  timestamp: string;
}

export class SqlStorage implements IStorage {
  private connection!: Connection;

  constructor() {
    this.init();
  }

  private async init() {
    this.connection = await createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
      password: process.env.MYSQL_PASSWORD,
    });
  }

  public async save(message: string): Promise<void> {
    const query = "INSERT INTO messages(`id`,`message`) VALUES (?,?)";
    try {
      await this.connection.execute(query, [uuidv4(), message]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async getAll(): Promise<TMessage[]> {
    const query = "SELECT * from messages";
    try {
      const [rows] = await this.connection.execute<IMySQLEntry[]>(query);
      return rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
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
