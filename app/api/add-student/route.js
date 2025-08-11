import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(req) {
  try {
    const formData = await req.formData();
    const email = formData.get("email");

    // ✨ **CHECK FOR EXISTING EMAIL**
    // First, check if a student with the provided email already exists.
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

    // Handle file uploads
    await fs.mkdir(uploadDir, { recursive: true });

    const class10thPdf = formData.get("class10thMarksPdf");
    if (class10thPdf instanceof File) {
      const filePath = path.join(uploadDir, `${Date.now()}_${class10thPdf.name}`);
      await fs.writeFile(filePath, Buffer.from(await class10thPdf.arrayBuffer()));
      data.class10thMarksPdf = `/uploads/${path.basename(filePath)}`;
    }

    const class12thPdf = formData.get("class12thMarksPdf");
    if (class12thPdf instanceof File) {
      const filePath = path.join(uploadDir, `${Date.now()}_${class12thPdf.name}`);
      await fs.writeFile(filePath, Buffer.from(await class12thPdf.arrayBuffer()));
      data.class12thMarksPdf = `/uploads/${path.basename(filePath)}`;
    }

    const casteCert = formData.get("casteCertificate");
    if (casteCert instanceof File) {
      const filePath = path.join(uploadDir, `${Date.now()}_${casteCert.name}`);
      await fs.writeFile(filePath, Buffer.from(await casteCert.arrayBuffer()));
      data.casteCertificate = `/uploads/${path.basename(filePath)}`;
    }

    const photo = formData.get("photo");
    if (photo instanceof File) {
      const filePath = path.join(uploadDir, `${Date.now()}_${photo.name}`);
      await fs.writeFile(filePath, Buffer.from(await photo.arrayBuffer()));
      data.photo = `/uploads/${path.basename(filePath)}`;
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