import { query } from "@/lib/pool"; // Assuming you saved the utility in lib/pool.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 2. Define the raw SQL query
    // NOTE: The table name is "Student" (uppercase S) based on your Prisma schema.
    const sqlQuery = `
      SELECT * FROM "student"
      ORDER BY id DESC
    `;

    // 3. Execute the query using the pg pool
    const result = await query(sqlQuery);

    // The result object contains 'rows' which holds the returned data array
    const students = result.rows;

    console.log(students);

    // 4. Return the data
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("View students error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}
