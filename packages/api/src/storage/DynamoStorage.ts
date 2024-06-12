import {
  DynamoDBClient,
  DynamoDBClientConfig,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { IStorage } from ".";
import { TConversation, TMessage } from "../interfaces";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export enum EEntitiesPrefix {
  User = "USER",
  Conversation = "CONVERSATION",
  Message = "MESSAGE",
}

export class DynamoStorage implements IStorage {
  private ddbClient: DynamoDBClient;
  private ddbDocClient: DynamoDBDocumentClient;

  public constructor() {
    const config: DynamoDBClientConfig = {};

    if (process.env.DYNAMODB_ENDPOINT) {
      config["region"] = process.env.AWS_REGION;
      config["endpoint"] = process.env.DYNAMODB_ENDPOINT;
      config["credentials"] = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      };
    }

    this.ddbClient = new DynamoDBClient(config);
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

  public async createConversation(userId: string): Promise<void> {
    const id = uuidv4();
    const params: PutCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_MESSAGES,
      Item: {
        id,
        timestamp: Date.now(),
        type: EEntitiesPrefix.Conversation,
        pk: `${EEntitiesPrefix.User}#${userId}`,
        sk: `${EEntitiesPrefix.Conversation}#${id}`,
      },
    };

    try {
      await this.ddbDocClient.send(new PutCommand(params));
    } catch (err) {
      console.error(err);
      throw new Error("Failed to create conversation");
    }
  }

  public async saveMessage(
    userId: string,
    conversationId: string,
    message: string
  ): Promise<void> {
    const messageId = uuidv4();
    const params: PutCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_MESSAGES,
      Item: {
        id: messageId,
        timestamp: Date.now(),
        type: EEntitiesPrefix.Message,
        message,
        pk: `${EEntitiesPrefix.User}#${userId}`,
        sk: `${EEntitiesPrefix.Conversation}#${conversationId}#${EEntitiesPrefix.Message}#${messageId}`,
      },
    };

    try {
      await this.ddbDocClient.send(new PutCommand(params));
    } catch (err) {
      console.error(err);
      throw new Error("Failed to save message");
    }
  }

  public async getConversations(userId: string): Promise<TConversation[]> {
    const params: QueryCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_MESSAGES,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: marshall({
        ":pk": `${EEntitiesPrefix.User}#${userId}`,
        ":sk": EEntitiesPrefix.Conversation,
        // ":type": EEntitiesPrefix.Conversation
      }),
      // FilterExpression: "type = :type"
    };

    try {
      const data = await this.ddbDocClient.send(new QueryCommand(params));
      return (
        data.Items?.map((item) => unmarshall(item))
          // TODO: FILTER BY GSI NOT LIKE THIS!!
          .filter((item) => item.type === EEntitiesPrefix.Conversation)
          .map((item) => ({
            id: item.id,
            timestamp: item.timestamp,
          })) || []
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  public async getMessages(
    userId: string,
    conversationId: string
  ): Promise<TMessage[]> {
    const params: QueryCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_MESSAGES,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: marshall({
        ":pk": `${EEntitiesPrefix.User}#${userId}`,
        ":sk": `${EEntitiesPrefix.Conversation}#${conversationId}#${EEntitiesPrefix.Message}`,
      }),
    };

    try {
      const data = await this.ddbDocClient.send(new QueryCommand(params));
      return (
        data.Items?.map((item) => unmarshall(item)).map((item) => ({
          id: item.id,
          message: item.message,
          timestamp: item.timestamp,
        })) || []
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
