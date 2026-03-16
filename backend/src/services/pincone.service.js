import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index(
  { 
    name: "zaid" ,
    host: "https://zaid-hn833ry.svc.aped-4627-b74a.pinecone.io"
  }
);

export {index}