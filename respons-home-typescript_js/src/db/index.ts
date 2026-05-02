import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Reuse pool across hot-reloads in development; create once in production
const globalForDb = globalThis as typeof globalThis & {
  __orcanomicsPool?: Pool;
};

export const pool =
  globalForDb.__orcanomicsPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 10,                // max connections in pool
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__orcanomicsPool = pool;
}

// Surface pool errors instead of silently crashing
pool.on("error", (err) => {
  console.error("[db] Unexpected pool error:", err);
});

export const db = drizzle(pool);
