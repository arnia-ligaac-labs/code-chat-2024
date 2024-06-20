import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { PineconeStore } from "@langchain/pinecone";
import { config } from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({
  path: path.join(__dirname, "..", ".env"),
});

const embeddingsClient = new BedrockEmbeddings({
  model: "amazon.titan-embed-text-v2:0",
  region: "us-east-1",
});

const pdfLoaderClient = new PDFLoader(
  "/workspace/packages/llm/src/notebooks/data/7-2022-Shareholder-Letter.pdf"
);

const rawPdfDocuments = await pdfLoaderClient.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,
  chunkOverlap: 30,
});
 
const splitDocs = await splitter.splitDocuments(rawPdfDocuments);

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const pineconeIndex = pc.index(process.env.PINECONE_INDEX);

const pineconeStore = new PineconeStore(embeddingsClient, {
  pineconeIndex,
});

await pineconeStore.addDocuments(splitDocs);
console.log("Successfully added documents to Pinecone!");
