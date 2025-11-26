// test-db-connection.js

import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("FATAL: DATABASE_URL not found in .env file.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // REQUIRED for AWS RDS
  },
});

async function testConnection() {
  console.log("Attempting to connect to RDS...");

  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ SUCCESS! Connection to RDS is established.");
    console.log("Current Database Time:", result.rows[0].now);

    const dbNameResult = await pool.query("SELECT current_database()");
    console.log("Connected Database:", dbNameResult.rows[0].current_database);
  } catch (err) {
    console.error("❌ FAILURE! Connection Error:");
    console.error(err);
  } finally {
    await pool.end();
  }
}

testConnection();
