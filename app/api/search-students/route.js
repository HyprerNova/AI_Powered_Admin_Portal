import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { query } from "@/lib/pool";

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      // If the query is empty, return all students
      const students = await query("SELECT * FROM student ORDER BY id DESC");
      return NextResponse.json(students.rows);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // This is the core of the feature. We provide the AI with the structure
    // of our database and ask it to convert a user's query into a JSON
    // object that Prisma can use for filtering.
    const prompt = `
      You are an expert at converting natural language queries into PostgreSQL WHERE clause strings and their corresponding parameters.
      Your task is to take the user's query and generate a valid JSON object with a "whereClause" (a SQL WHERE clause string) and "params" (an array of values for the WHERE clause).
      You must only respond with the JSON object and nothing else.

      This is the schema of the "student" table you are working with (all column names are lowercase):
      - id: INTEGER
      - name: VARCHAR
      - email: VARCHAR
      - phonenumber: VARCHAR
      - address: VARCHAR (contains the city/state of the student, e.g., "Bengaluru")
      - gender: VARCHAR ("Male", "Female", "Other")
      - fathername: VARCHAR
      - mothername: VARCHAR
      - fatheremail: VARCHAR
      - motheremail: VARCHAR
      - fathernumber: VARCHAR
      - mothernumber: VARCHAR
      - class10thmarks: FLOAT
      - class12thmarks: FLOAT
      - class10thmarkspdf: VARCHAR (S3 URL)
      - class12thmarkspdf: VARCHAR (S3 URL)
      - photo: VARCHAR (S3 URL)
      - class10thschoolname: VARCHAR
      - class12thschoolname: VARCHAR
      - modeofadmission: VARCHAR ("KCET", "COMEDK", "MANAGEMENT")
      - caste: VARCHAR
      - castecertificate: VARCHAR (S3 URL)
      - createdat: TIMESTAMP WITH TIME ZONE

      Some examples of how to translate queries:
      - "students from mangalore": {"whereClause":"address ILIKE $1","params":["%mangalore%"]}
      - "show me all female students": {"whereClause":"gender = $1","params":["Female"]}
      - "students with 12th marks above 90": {"whereClause":"class12thmarks > $1","params":[90]}
      - "students admitted through KCET with 10th marks below 75": {"whereClause":"modeofadmission = $1 AND class10thmarks < $2","params":["KCET",75]}
      - "students whose name is Rahul": {"whereClause":"name ILIKE $1","params":["%Rahul%"]}
      - "students named John or Jane": {"whereClause":"name ILIKE $1 OR name ILIKE $2","params":["%John%","%Jane%"]}
      - "students created before 2023-01-01": {"whereClause":"createdat < $1","params":["2023-01-01T00:00:00.000Z"]}
      
      User's query: "${query}"
      
      Generate the SQL WHERE clause JSON object now.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let sqlFilter = { whereClause: "", params: [] };

    try {
      const jsonResponse = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      sqlFilter = JSON.parse(jsonResponse);

      if (!sqlFilter.whereClause || !Array.isArray(sqlFilter.params)) {
        throw new Error("Invalid AI response format");
      }
    } catch (e) {
      console.error("Failed to parse AI response into SQL filter:", e);
      return NextResponse.json(
        { error: "Failed to process your query." },
        { status: 400 },
      );
    }

    const baseQuery = `SELECT * FROM student`;
    const fullQuery = sqlFilter.whereClause
      ? `${baseQuery} WHERE ${sqlFilter.whereClause} ORDER BY id DESC`
      : `${baseQuery} ORDER BY id DESC`;

    const studentResult = await query(fullQuery, sqlFilter.params);
    const students = studentResult.rows;

    return NextResponse.json(students);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to execute search" },
      { status: 500 },
    );
  }
}
