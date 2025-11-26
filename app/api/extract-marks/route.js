import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Important: This config is not needed for the new approach
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req) {
  try {
    const formData = await req.formData();
    const marksheet = formData.get("marksheet");
    const marksType = formData.get("marksType");

    if (!marksheet || !(marksheet instanceof File)) {
      return NextResponse.json(
        { error: "No marksheet file uploaded." },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert the file to base64 for the Gemini API
    const arrayBuffer = await marksheet.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Create the image object for Gemini
    const image = {
      inlineData: {
        data: base64Data,
        mimeType: marksheet.type,
      },
    };

    // Craft the prompt for the AI
    const promptText = `
      You are an expert at extracting percentages from student marksheets.
      Your task is to analyze the provided image and extract the final percentage for the student. If they are 5 subjects, then add all the marks and divide by 5 and give the percentage.
      The marksheet is for ${marksType}.
      
      You must respond only with a single floating-point number representing the percentage.
      Do not include any other text, explanations, or JSON formatting.
      For example, if the percentage is 85.5, your response should be "85.5".
      If you cannot find the percentage, return "0".
    `;

    // Send the prompt and image to the Gemini API
    const result = await model.generateContent([promptText, image]);
    const response = await result.response;
    const extractedMarks = parseFloat(response.text());

    if (isNaN(extractedMarks)) {
      return NextResponse.json(
        { error: "Failed to extract a valid number from the marksheet." },
        { status: 400 },
      );
    }

    return NextResponse.json({ marks: extractedMarks });
  } catch (error) {
    console.error("Error extracting marks:", error);
    return NextResponse.json(
      { error: "Failed to process the marksheet." },
      { status: 500 },
    );
  }
}
