import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      // If the query is empty, return all students
      const students = await prisma.student.findMany({
        orderBy: { id: "desc" },
      });
      return NextResponse.json(students);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // This is the core of the feature. We provide the AI with the structure
    // of our database and ask it to convert a user's query into a JSON
    // object that Prisma can use for filtering.
    const prompt = `
      You are an expert at converting natural language queries into Prisma query objects.
      Your task is to take the user's query and generate a valid Prisma "where" filter object.
      You must only respond with the JSON object and nothing else.

      This is the schema of the "Student" model you are working with:
      - id: Int
      - name: String
      - email: String
      - address: String (contains the city/state of the student, e.g., "Bengaluru")
      - gender: String ("Male", "Female", "Other")
      - class10thMarks: Float
      - class12thMarks: Float
      - modeOfAdmission: String ("KCET", "COMEDK", "MANAGEMENT")
      - caste: String

      Some examples of how to translate queries:
      - "students from mangalore": {"address":{"contains":"mangalore","mode":"insensitive"}}
      - "show me all female students": {"gender":{"equals":"Female"}}
      - "students with 12th marks above 90": {"class12thMarks":{"gt":90}}
      - "students admitted through KCET with 10th marks below 75": {"AND":[{"modeOfAdmission":{"equals":"KCET"}},{"class10thMarks":{"lt":75}}]}
      - "students whose name is Rahul": {"name":{"contains":"Rahul","mode":"insensitive"}}
      
      User's query: "${query}"
      
      Generate the Prisma "where" JSON object now.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let prismaFilter = {};

    try {
      // Clean up the AI's response to ensure it's valid JSON
      const jsonResponse = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      prismaFilter = JSON.parse(jsonResponse);
    } catch (e) {
      console.error("Failed to parse AI response into JSON:", e);
      // If parsing fails, return an error or an empty array
      return NextResponse.json(
        { error: "Failed to process your query." },
        { status: 400 },
      );
    }

    const students = await prisma.student.findMany({
      where: prismaFilter,
      orderBy: { id: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to execute search" },
      { status: 500 },
    );
  }
}
