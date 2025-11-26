import { NextResponse } from "next/server";
import { query } from "@/lib/pool";

export async function GET() {
  try {
    const studentResult = await query(`SELECT * FROM student ORDER BY id DESC`);
    const students = studentResult.rows;
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("View students error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}
