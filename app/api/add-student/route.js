import { NextResponse } from "next/server";
import { uploadToS3, generateFileName } from "../../../lib/s3";
import { query } from "@/lib/pool";

// Helper function to safely check if an item from formData is a file
// without referencing the global 'File' object directly, which causes the crash.
const isFile = (item) => {
  // A valid file object from formData should be an object and have a size property > 0
  return item && typeof item === "object" && item.size > 0;
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const email = formData.get("email");

    // 1. Check for existing student by email
    const existingResult = await query(
      "SELECT id FROM student WHERE email = $1",
      [email],
    );
    const existingStudent = existingResult.rows[0];

    if (existingStudent) {
      return NextResponse.json(
        { error: "A student with this email already exists." },
        { status: 409 }, // 409 Conflict
      );
    }

    // 2. Assemble non-file data
    const data = {
      name: formData.get("name"),
      email: email,
      phoneNumber: formData.get("phoneNumber"),
      address: formData.get("address"),
      gender: formData.get("gender"),
      fatherName: formData.get("fatherName"),
      motherName: formData.get("motherName"),
      fatherEmail: formData.get("fatherEmail") || null,
      motherEmail: formData.get("motherEmail") || null,
      fatherNumber: formData.get("fatherNumber") || null,
      motherNumber: formData.get("motherNumber") || null,
      // Parse float for marks
      class10thMarks: parseFloat(formData.get("class10thMarks")),
      class12thMarks: parseFloat(formData.get("class12thMarks")),
      class10thMarksPdf: null,
      class12thMarksPdf: null,
      class10thSchoolName: formData.get("class10thSchoolName"),
      class12thSchoolName: formData.get("class12thSchoolName"),
      modeOfAdmission: formData.get("modeOfAdmission"),
      caste: formData.get("caste"),
      casteCertificate: null,
      photo: null,
    };

    // 3. Handle file uploads to S3

    // File 1: 10th Marks PDF
    const class10thPdf = formData.get("class10thMarksPdf");
    if (isFile(class10thPdf)) {
      const fileName = generateFileName(class10thPdf.name, "10th_marks_");
      const fileBuffer = Buffer.from(await class10thPdf.arrayBuffer());
      const uploadResult = await uploadToS3(
        fileBuffer,
        fileName,
        class10thPdf.type,
      );
      if (uploadResult.success) {
        data.class10thMarksPdf = uploadResult.url;
      } else {
        return NextResponse.json(
          { error: "Failed to upload 10th marks PDF" },
          { status: 500 },
        );
      }
    }

    // File 2: 12th Marks PDF
    const class12thPdf = formData.get("class12thMarksPdf");
    if (isFile(class12thPdf)) {
      const fileName = generateFileName(class12thPdf.name, "12th_marks_");
      const fileBuffer = Buffer.from(await class12thPdf.arrayBuffer());
      const uploadResult = await uploadToS3(
        fileBuffer,
        fileName,
        class12thPdf.type,
      );
      if (uploadResult.success) {
        data.class12thMarksPdf = uploadResult.url;
      } else {
        return NextResponse.json(
          { error: "Failed to upload 12th marks PDF" },
          { status: 500 },
        );
      }
    }

    // File 3: Caste Certificate
    const casteCert = formData.get("casteCertificate");
    if (isFile(casteCert)) {
      const fileName = generateFileName(casteCert.name, "caste_cert_");
      const fileBuffer = Buffer.from(await casteCert.arrayBuffer());
      const uploadResult = await uploadToS3(
        fileBuffer,
        fileName,
        casteCert.type,
      );
      if (uploadResult.success) {
        data.casteCertificate = uploadResult.url;
      } else {
        return NextResponse.json(
          { error: "Failed to upload caste certificate" },
          { status: 500 },
        );
      }
    }

    // File 4: Photo
    const photo = formData.get("photo");
    if (isFile(photo)) {
      const fileName = generateFileName(photo.name, "photo_");
      const fileBuffer = Buffer.from(await photo.arrayBuffer());
      const uploadResult = await uploadToS3(fileBuffer, fileName, photo.type);

      if (uploadResult.success) {
        data.photo = uploadResult.url;
      } else {
        return NextResponse.json(
          { error: "Failed to upload photo" },
          { status: 500 },
        );
      }
    }

    // 4. Create the new student record in the database (RDS)
    const insertResult = await query(
      `INSERT INTO student (
                name,
                email,
                phoneNumber,
                address,
                gender,
                fatherName,
                motherName,
                fatherEmail,
                motherEmail,
                fatherNumber,
                motherNumber,
                class10thMarks,
                class12thMarks,
                class10thMarksPdf,
                class12thMarksPdf,
                class10thSchoolName,
                class12thSchoolName,
                modeOfAdmission,
                photo
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15,
                $16, $17, $18, $19
            ) RETURNING *`,
      [
        data.name,
        data.email,
        data.phoneNumber,
        data.address,
        data.gender,
        data.fatherName,
        data.motherName,
        data.fatherEmail,
        data.motherEmail,
        data.fatherNumber,
        data.motherNumber,
        data.class10thMarks,
        data.class12thMarks,
        data.class10thMarksPdf,
        data.class12thMarksPdf,
        data.class10thSchoolName,
        data.class12thSchoolName,
        data.modeOfAdmission,
        data.photo,
      ],
    );

    const student = insertResult.rows[0];

    return NextResponse.json(
      { message: "Student added successfully", student },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add student error:", error);

    // Handle duplicate email at DB level (unique constraint)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A student with this email already exists." },
        { status: 409 },
      );
    }

    // Return a 500 status for all other errors, which includes the File ReferenceError
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 },
    );
  }
}
