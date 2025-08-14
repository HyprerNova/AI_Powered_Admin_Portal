import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { uploadToS3, generateFileName } from "../../../lib/s3";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();
    const email = formData.get("email");

    const existingStudent = await prisma.student.findUnique({
      where: {
        email: email,
      },
    });

    // If a student is found, return an error response immediately.
    if (existingStudent) {
      return NextResponse.json(
        { error: "A student with this email already exists." },
        { status: 409 } // 409 Conflict is an appropriate HTTP status code.
      );
    }
    
    // If no existing student, proceed with data assembly and file uploads.
    const data = {
      name: formData.get("name"),
      email: email, // Use the email variable
      phoneNumber: formData.get("phoneNumber"),
      address: formData.get("address"),
      gender: formData.get("gender"),
      fatherName: formData.get("fatherName"),
      motherName: formData.get("motherName"),
      fatherEmail: formData.get("fatherEmail") || null,
      motherEmail: formData.get("motherEmail") || null,
      fatherNumber: formData.get("fatherNumber") || null,
      motherNumber: formData.get("motherNumber") || null,
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

    // Handle file uploads to S3
    const class10thPdf = formData.get("class10thMarksPdf");
    if (class10thPdf instanceof File) {
      const fileName = generateFileName(class10thPdf.name, "10th_marks_");
      const fileBuffer = Buffer.from(await class10thPdf.arrayBuffer());
      const uploadResult = await uploadToS3(fileBuffer, fileName, class10thPdf.type);
      
      if (uploadResult.success) {
        data.class10thMarksPdf = uploadResult.url;
      } else {
        return NextResponse.json({ error: "Failed to upload 10th marks PDF" }, { status: 500 });
      }
    }

    const class12thPdf = formData.get("class12thMarksPdf");
    if (class12thPdf instanceof File) {
      const fileName = generateFileName(class12thPdf.name, "12th_marks_");
      const fileBuffer = Buffer.from(await class12thPdf.arrayBuffer());
      const uploadResult = await uploadToS3(fileBuffer, fileName, class12thPdf.type);
      
      if (uploadResult.success) {
        data.class12thMarksPdf = uploadResult.url;
      } else {
        return NextResponse.json({ error: "Failed to upload 12th marks PDF" }, { status: 500 });
      }
    }

    const casteCert = formData.get("casteCertificate");
    if (casteCert instanceof File) {
      const fileName = generateFileName(casteCert.name, "caste_cert_");
      const fileBuffer = Buffer.from(await casteCert.arrayBuffer());
      const uploadResult = await uploadToS3(fileBuffer, fileName, casteCert.type);
      
      if (uploadResult.success) {
        data.casteCertificate = uploadResult.url;
      } else {
        return NextResponse.json({ error: "Failed to upload caste certificate" }, { status: 500 });
      }
    }

    const photo = formData.get("photo");
    if (photo instanceof File) {
      const fileName = generateFileName(photo.name, "photo_");
      const fileBuffer = Buffer.from(await photo.arrayBuffer());
      const uploadResult = await uploadToS3(fileBuffer, fileName, photo.type);
      
      if (uploadResult.success) {
        data.photo = uploadResult.url;
      } else {
        return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
      }
    }

    // Create the new student record in the database
    const student = await prisma.student.create({
      data,
    });

    return NextResponse.json({ message: "Student added successfully", student }, { status: 201 });
  } catch (error) {
    console.error("Add student error:", error);
    
    // Add a fallback for Prisma's unique constraint violation error
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json({ error: "A student with this email already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to add student" }, { status: 500 });
  }
}