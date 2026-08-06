/*
 * mongodb.ts
 * Date: June 2025
 * Description: MongoDB connection utility for the StaffSync application.
 *   Provides a singleton MongoClient connection that is reused across
 *   requests to avoid exceeding the database connection limit.
 * Inputs:  MONGODB_URI environment variable (connection string).
 * Processing: In development, caches the client promise on the global
 *   object to survive hot-module reloads. In production, creates a
 *   fresh client per server instance.
 * Outputs: Exports clientPromise (Promise<MongoClient>) and the
 *   connectToDatabase() helper that returns { client, db }.
 */

import { MongoClient, type Db } from "mongodb";

// ─── Guard ────────────────────────────────────────────────────────────────────

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please add MONGODB_URI to your .env.local file.\n" +
      "See .env.local.example for the required format."
  );
}

const uri = process.env.MONGODB_URI;

// ─── Singleton client ─────────────────────────────────────────────────────────
// In development, reuse the cached promise across hot-module reloads.
// In production, create a new client once per server process.

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Returns the connected MongoClient and the target database.
 * Uses the MONGODB_DB_NAME env var, falling back to "staffsync".
 */
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME ?? "staffsync");
  return { client, db };
}

export default clientPromise;
