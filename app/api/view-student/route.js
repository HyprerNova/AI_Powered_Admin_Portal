import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("View students error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}
