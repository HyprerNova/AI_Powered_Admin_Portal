// test-db-connection.js
// This script runs outside of Next.js to test the network connection.

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
  // Add SSL config here if needed for production, but usually not for local test with SG open
  // ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  console.log("Attempting to connect to RDS...");
  try {
    // Run a simple query to test the connection
    const result = await pool.query("SELECT NOW()");
    console.log("✅ SUCCESS! Connection to RDS is established.");
    console.log("Current Database Time:", result.rows[0].now);

    // Final check: Is the correct database selected?
    const dbNameResult = await pool.query("SELECT current_database()");
    console.log("Connected Database:", dbNameResult.rows[0].current_database);
  } catch (err) {
    console.error("❌ FAILURE! Connection Error:");
    console.error(err);
    if (err.code === "ETIMEDOUT") {
      console.error("\n--- Network Blocked ---");
      console.error(
        "The ETIMEDOUT error means the RDS Security Group is blocking your connection.",
      );
      console.error(
        "ACTION: Double-check that your *current* public IP is whitelisted on Port 5432 in the RDS Security Group.",
      );
    } else if (err.code === "28P01") {
      console.error("\n--- Authentication Failed ---");
      console.error(
        "ACTION: Check the username and password in your DATABASE_URL.",
      );
    }
  } finally {
    await pool.end(); // Close the pool
  }
}

testConnection();
