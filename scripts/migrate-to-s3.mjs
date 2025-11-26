#!/usr/bin/env node

/**
 * Migration script to move existing local files to S3
 * Run this script after setting up your S3 bucket and environment variables
 */

import { uploadToS3, generateFileName } from "../lib/s3.js";
import { query } from "../lib/pool.js"; // Import the query function
import fs from "fs/promises";
import path from "path";

async function migrateFilesToS3() {
  try {
    console.log("🚀 Starting migration to S3...");

    // Get all students with local file paths
    const selectStudentsQuery = `
      SELECT id, name, email, phonenumber, address, gender, fathername, mothername,
             fatheremail, motheremail, fathernumber, mothernumber, class10thmarks,
             class12thmarks, class10thmarkspdf, class12thmarkspdf, photo,
             class10thschoolname, class12thschoolname, modeofadmission, caste,
             castecertificate, createdat
      FROM student
      WHERE
        class10thmarkspdf LIKE '/uploads/%' OR
        class12thmarkspdf LIKE '/uploads/%' OR
        castecertificate LIKE '/uploads/%' OR
        photo LIKE '/uploads/%'
    `;
    const studentResult = await query(selectStudentsQuery);
    const students = studentResult.rows;

    console.log(
      `📋 Found ${students.length} students with local files to migrate`,
    );

    for (const student of students) {
      console.log(
        `\n🔄 Processing student: ${student.name} (${student.email})`,
      );

      const updates = {};

      // Migrate 10th marks PDF
      if (
        student.class10thMarksPdf &&
        student.class10thMarksPdf.startsWith("/uploads/")
      ) {
        const localPath = path.join(
          process.cwd(),
          "public",
          student.class10thMarksPdf,
        );
        try {
          const fileBuffer = await fs.readFile(localPath);
          const fileName = generateFileName(
            path.basename(student.class10thMarksPdf),
            "10th_marks_",
          );
          const uploadResult = await uploadToS3(
            fileBuffer,
            fileName,
            "application/pdf",
          );

          if (uploadResult.success) {
            updates.class10thMarksPdf = uploadResult.url;
            console.log(`  ✅ 10th marks PDF migrated: ${uploadResult.url}`);
          } else {
            console.log(
              `  ❌ Failed to migrate 10th marks PDF: ${uploadResult.error}`,
            );
          }
        } catch (error) {
          console.log(`  ⚠️  Error reading 10th marks PDF: ${error.message}`);
        }
      }

      // Migrate 12th marks PDF
      if (
        student.class12thMarksPdf &&
        student.class12thMarksPdf.startsWith("/uploads/")
      ) {
        const localPath = path.join(
          process.cwd(),
          "public",
          student.class12thMarksPdf,
        );
        try {
          const fileBuffer = await fs.readFile(localPath);
          const fileName = generateFileName(
            path.basename(student.class12thMarksPdf),
            "12th_marks_",
          );
          const uploadResult = await uploadToS3(
            fileBuffer,
            fileName,
            "application/pdf",
          );

          if (uploadResult.success) {
            updates.class12thMarksPdf = uploadResult.url;
            console.log(`  ✅ 12th marks PDF migrated: ${uploadResult.url}`);
          } else {
            console.log(
              `  ❌ Failed to migrate 12th marks PDF: ${uploadResult.error}`,
            );
          }
        } catch (error) {
          console.log(`  ⚠️  Error reading 12th marks PDF: ${error.message}`);
        }
      }

      // Migrate caste certificate
      if (
        student.casteCertificate &&
        student.casteCertificate.startsWith("/uploads/")
      ) {
        const localPath = path.join(
          process.cwd(),
          "public",
          student.casteCertificate,
        );
        try {
          const fileBuffer = await fs.readFile(localPath);
          const fileName = generateFileName(
            path.basename(student.casteCertificate),
            "caste_cert_",
          );
          const uploadResult = await uploadToS3(
            fileBuffer,
            fileName,
            "application/pdf",
          );

          if (uploadResult.success) {
            updates.casteCertificate = uploadResult.url;
            console.log(`  ✅ Caste certificate migrated: ${uploadResult.url}`);
          } else {
            console.log(
              `  ❌ Failed to migrate caste certificate: ${uploadResult.error}`,
            );
          }
        } catch (error) {
          console.log(
            `  ⚠️  Error reading caste certificate: ${error.message}`,
          );
        }
      }

      // Migrate photo
      if (student.photo && student.photo.startsWith("/uploads/")) {
        const localPath = path.join(process.cwd(), "public", student.photo);
        try {
          const fileBuffer = await fs.readFile(localPath);
          const fileName = generateFileName(
            path.basename(student.photo),
            "photo_",
          );
          const uploadResult = await uploadToS3(
            fileBuffer,
            fileName,
            "image/jpeg",
          );

          if (uploadResult.success) {
            updates.photo = uploadResult.url;
            console.log(`  ✅ Photo migrated: ${uploadResult.url}`);
          } else {
            console.log(`  ❌ Failed to migrate photo: ${uploadResult.error}`);
          }
        } catch (error) {
          console.log(`  ⚠️  Error reading photo: ${error.message}`);
        }
      }

      // Update student record if there are changes
      if (Object.keys(updates).length > 0) {
        const setClauses = Object.keys(updates)
          .map((key, index) => `"${key}" = $${index + 2}`)
          .join(", ");
        const updateParams = Object.values(updates);

        const updateStudentQuery = `
          UPDATE student
          SET ${setClauses}
          WHERE id = $1
        `;
        await query(updateStudentQuery, [student.id, ...updateParams]);
        console.log(`  💾 Student record updated in database`);
      }
    }

    console.log("\n🎉 Migration completed!");
    console.log("\n⚠️  Next steps:");
    console.log("1. Verify all files are accessible via S3 URLs");
    console.log("2. Test the application with the new S3 setup");
    console.log(
      "3. Once confirmed working, you can delete the local uploads directory",
    );
    console.log("4. Remove the migration script");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    // No prisma.$disconnect() needed after removing Prisma
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateFilesToS3();
}

export { migrateFilesToS3 };
