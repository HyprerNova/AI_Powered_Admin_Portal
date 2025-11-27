// /app/api/student/delete/route.js (or equivalent)

import { NextResponse } from "next/server";
import { query } from "@/lib/pool"; // Import your custom pg query function
import { deleteFromS3, getFileKeyFromUrl } from "../../../lib/s3";

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    console.log(id);

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    const studentId = parseInt(id);

    // --- 1. Retrieve Student Data (Replaced prisma.student.findUnique) ---
    const selectQuery = `
      SELECT "class10thmarkspdf", "class12thmarkspdf", "photo" 
      FROM "student" 
      WHERE id = $1
    `;
    const studentResult = await query(selectQuery, [studentId]);
    const student = studentResult.rows[0];

    if (student) {
      // --- 2. Delete Files from S3 (S3 logic remains the same) ---
      // We assume getFileKeyFromUrl and deleteFromS3 are working
      const filesToDelete = [
        student.class10thMarksPdf,
        student.class12thMarksPdf,
        student.photo,
      ].filter(Boolean); // Filter out null/undefined values

      for (const fileUrl of filesToDelete) {
        const fileKey = getFileKeyFromUrl(fileUrl);
        if (fileKey) {
          await deleteFromS3(fileKey);
        }
      }

      // --- 3. Delete student from database (Replaced prisma.student.delete) ---
      const deleteQuery = `
        DELETE FROM "student"
        WHERE id = $1
      `;
      const deleteResult = await query(deleteQuery, [studentId]);

      // Optional: Check if a row was actually deleted
      if (deleteResult.rowCount === 0) {
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 },
        );
      }
    } else {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 },
    );
  }
}
