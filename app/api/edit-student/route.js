import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await request.formData();
  const id = formData.get("id");
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
    class10thMarksPdf: formData.get("class10thMarksPdf")?.name ? await saveFile(formData.get("class10thMarksPdf")) : undefined,
    class12thMarksPdf: formData.get("class12thMarksPdf")?.name ? await saveFile(formData.get("class12thMarksPdf")) : undefined,
    photo: formData.get("photo")?.name ? await saveFile(formData.get("photo")) : undefined,
    class10thSchoolName: formData.get("class10thSchoolName"),
    class12thSchoolName: formData.get("class12thSchoolName"),
    modeOfAdmission: formData.get("modeOfAdmission"),
    caste: formData.get("caste"),
    casteCertificate: formData.get("casteCertificate")?.name ? await saveFile(formData.get("casteCertificate")) : undefined,
  };

  await prisma.student.update({
    where: { id: parseInt(id) },
    data,
  });

  redirect("/view-student");
}

async function saveFile(file) {
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const filePath = path.join(uploadsDir, fileName);
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));
  return `/uploads/${fileName}`;
}