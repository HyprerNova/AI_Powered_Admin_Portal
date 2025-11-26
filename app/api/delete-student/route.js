import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { deleteFromS3, getFileKeyFromUrl } from "../../../lib/s3";

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    // Get student data to delete associated files
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });

    if (student) {
      // Delete files from S3
      const filesToDelete = [
        student.class10thMarksPdf,
        student.class12thMarksPdf,
        student.casteCertificate,
        student.photo,
      ].filter(Boolean);

      for (const fileUrl of filesToDelete) {
        const fileKey = getFileKeyFromUrl(fileUrl);
        if (fileKey) {
          await deleteFromS3(fileKey);
        }
      }
    }

    // Delete student from database
    await prisma.student.delete({
      where: { id: parseInt(id) },
    });

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
