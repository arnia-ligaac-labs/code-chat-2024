import { Bedrock } from "@langchain/community/llms/bedrock";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { DynamoDBChatMessageHistory } from "@langchain/community/stores/message/dynamodb";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

const model = new Bedrock({
  model_id: "amazon.titan-text-express-v1",
  temperature: 1,
  maxTokenCount: 512,
  topP: 0.9,
  verbose: true,
});

const embeddingClient = new BedrockEmbeddings({
  model: "amazon.titan-embed-text-v2:0",
  region: "us-east-1",
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's question given the following context: {context}",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

const loader = new CheerioWebBaseLoader(
  "https://python.langchain.com/v0.1/docs/expression_language/"
);

const docs = await loader.load();
// console.log(docs);
// console.log("Loaded docs");

const splitter = new RecursiveCharacterTextSplitter({
  maxCharacters: 512,
  minCharacters: 10,
  chunkOverlap: 30,
});

const splitDocs = await splitter.splitDocuments(docs);

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddingClient
);
// console.log("Created vector store");
var vectorStoreRetriever = vectorStore.asRetriever({ k: 3 });

const combineDocsChain = await createStuffDocumentsChain({
  llm: model,
  prompt,
});
// console.log("Created combine docs chain");

const rephrasePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question just reformulate it if needed and otherwise return it as is.",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

const retriever = await createHistoryAwareRetriever({
  llm: model,
  retriever: vectorStoreRetriever,
  rephrasePrompt,
});

const runnable = await createRetrievalChain({
  combineDocsChain,
  retriever,
});

const getMessageHistory = function getMessageHistory(sessionId) {
  return new DynamoDBChatMessageHistory({
    tableName: "CodeChat-Messages-LOCAL",
    partitionKey: "id",
    sortKey: "timestamp",
    sessionId: sessionId,
    config: {
      region: "eu-west-1",
      endpoint: "http://dynamodb:8000",
      credentials: {
        accessKeyId: "dummy",
        secretAccessKey: "dummy",
      },
    },
  });
};

const chainWithHistory = new RunnableWithMessageHistory({
  runnable,
  getMessageHistory,
  inputMessageKey: "input",
  outputMessagesKey: "answer",
  historyMessagesKey: "chat_history",
});

const response = await chainWithHistory.invoke(
  { input: "What is LCEL?" },
  {
    configurable: {
      sessionId: "testuser123",
    },
  }
);

console.log(response);
const response2 = await chainWithHistory.invoke(
  { input: "My pet's name is Cristian. What can we do with the LCEL ?" },
  {
    configurable: {
      sessionId: "testuser123",
    },
  }
);
console.log(response2);

const response3 = await chainWithHistory.invoke(
  { input: "What is my pet's name ?" },
  {
    configurable: {
      sessionId: "testuser123",
    },
  }
);
console.log(response3);
