import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { uploadToS3, generateFileName, deleteFromS3, getFileKeyFromUrl } from "../../../lib/s3";

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id");
    
    // Get current student data to check for existing files
    const currentStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

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
      class10thMarks: parseFloat(formData.get("class10thMarks")) || 0,
      class12thMarks: parseFloat(formData.get("class12thMarks")) || 0,
      class10thSchoolName: formData.get("class10thSchoolName"),
      class12thSchoolName: formData.get("class12thSchoolName"),
      modeOfAdmission: formData.get("modeOfAdmission"),
      caste: formData.get("caste"),
    };

    // Handle file uploads to S3
    const class10thPdf = formData.get("class10thMarksPdf");
    if (class10thPdf instanceof File && class10thPdf.size > 0) {
      // Delete old file if it exists
      if (currentStudent?.class10thMarksPdf) {
        const oldFileKey = getFileKeyFromUrl(currentStudent.class10thMarksPdf);
        if (oldFileKey) {
          await deleteFromS3(oldFileKey);
        }
      }
      
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
    if (class12thPdf instanceof File && class12thPdf.size > 0) {
      // Delete old file if it exists
      if (currentStudent?.class12thMarksPdf) {
        const oldFileKey = getFileKeyFromUrl(currentStudent.class12thMarksPdf);
        if (oldFileKey) {
          await deleteFromS3(oldFileKey);
        }
      }
      
      const fileName = generateFileName(class12thPdf.name, "12th_marks_");
      const fileBuffer = Buffer.from(await class12thPdf.arrayBuffer());
      const uploadResult = await uploadToS3(fileBuffer, fileName, class12thPdf.type);
      
      if (uploadResult.success) {
        data.class12thMarksPdf = uploadResult.url;
      } else {
        return NextResponse.json({ error: "Failed to upload 12th marks PDF" }, { status: 500 });
      }
    }

    const photo = formData.get("photo");
    if (photo instanceof File && photo.size > 0) {
      // Delete old file if it exists
      if (currentStudent?.photo) {
        const oldFileKey = getFileKeyFromUrl(currentStudent.photo);
        if (oldFileKey) {
          await deleteFromS3(oldFileKey);
        }
      }
      
      const fileName = generateFileName(photo.name, "photo_");
      const fileBuffer = Buffer.from(await photo.arrayBuffer());
      const uploadResult = await uploadToS3(fileBuffer, fileName, photo.type);
      
      if (uploadResult.success) {
        data.photo = uploadResult.url;
      } else {
        return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
      }
    }

    const casteCertificate = formData.get("casteCertificate");
    if (casteCertificate instanceof File && casteCertificate.size > 0) {
      // Delete old file if it exists
      if (currentStudent?.casteCertificate) {
        const oldFileKey = getFileKeyFromUrl(currentStudent.casteCertificate);
        if (oldFileKey) {
          await deleteFromS3(oldFileKey);
        }
      }
      
      const fileName = generateFileName(casteCertificate.name, "caste_cert_");
      const fileBuffer = Buffer.from(await casteCertificate.arrayBuffer());
      const uploadResult = await uploadToS3(fileBuffer, fileName, casteCertificate.type);
      
      if (uploadResult.success) {
        data.casteCertificate = uploadResult.url;
      } else {
        return NextResponse.json({ error: "Failed to upload caste certificate" }, { status: 500 });
      }
    }

    await prisma.student.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json({ message: "Student updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Edit student error:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}