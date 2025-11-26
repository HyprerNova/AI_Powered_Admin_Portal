// lib/pool.js

import { Pool } from "pg";

// Use DATABASE_URL from your .env file
const connectionString = process.env.DATABASE_URL;

if (!global.pgPool) {
  // If no pool exists, create one
  global.pgPool = new Pool({
    connectionString,
    // Add SSL configuration if you are using it (recommended for production)
    // ssl: {
    //   rejectUnauthorized: false
    // }
  });
  console.log("Database Pool Created.");
}

// Export a function to easily query the pool
export async function query(text, params) {
  const res = await global.pgPool.query(text, params);
  return res;
}

// Export the pool instance directly if needed elsewhere
export const pool = global.pgPool;
