import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IStorage } from ".";
import { TMessage } from "../interfaces";
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export class DynamoStorage implements IStorage {
  private ddbClient: DynamoDBClient;
  private ddbDocClient: DynamoDBDocumentClient;

  public constructor() {
    this.ddbClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });
    this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient);
  }

  public async save(message: string): Promise<void> {
    const params: PutCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_MESSAGES,
      Item: { id: uuidv4(), message, timestamp: Date.now() },
    };

    try {
      await this.ddbDocClient.send(new PutCommand(params));
    } catch (err) {
      console.error(err);
    }
  }

  public async getAll(): Promise<TMessage[]> {
    const params: ScanCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_MESSAGES,
    };

    try {
      const data = await this.ddbDocClient.send(new ScanCommand(params));
      return data.Items as TMessage[];
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
