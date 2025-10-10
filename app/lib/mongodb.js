// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "mydb";

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = globalThis._mongo; 

if (!cached) {
  cached = globalThis._mongo = { conn: null, client: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  const client = new MongoClient(uri, {
    // options if needed
  });

  await client.connect();
  const db = client.db(dbName);

  cached.client = client;
  cached.conn = { client, db };
  return cached.conn;
}
