import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(req) {
  try {
    const formData = await req.formData();
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
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

    const student = await prisma.student.create({
      data,
    });

    return NextResponse.json({ message: "Student added successfully", student }, { status: 201 });
  } catch (error) {
    console.error("Add student error:", error);
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 });
  }
}