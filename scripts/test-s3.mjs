#!/usr/bin/env node

/**
 * Test script to verify S3 connectivity and configuration
 * Run this before attempting to use the application with S3
 */

import { uploadToS3, deleteFromS3 } from "../lib/s3.js";

async function testS3Connection() {
  try {
    console.log("🧪 Testing S3 connection...");

    // Test file upload
    const testContent = "This is a test file for S3 connectivity";
    const testBuffer = Buffer.from(testContent, "utf8");
    const testFileName = `test_${Date.now()}.txt`;

    console.log("📤 Testing file upload...");
    const uploadResult = await uploadToS3(
      testBuffer,
      testFileName,
      "text/plain",
    );

    if (uploadResult.success) {
      console.log("✅ File upload successful!");
      console.log(`   File URL: ${uploadResult.url}`);
      console.log(`   File Key: ${uploadResult.key}`);

      // Test file deletion
      console.log("🗑️  Testing file deletion...");
      const deleteResult = await deleteFromS3(testFileName);

      if (deleteResult.success) {
        console.log("✅ File deletion successful!");
      } else {
        console.log("❌ File deletion failed:", deleteResult.error);
      }
    } else {
      console.log("❌ File upload failed:", uploadResult.error);
      console.log("\n🔍 Troubleshooting tips:");
      console.log("1. Check your AWS credentials in .env.local");
      console.log("2. Verify AWS_S3_BUCKET_NAME is correct");
      console.log("3. Ensure AWS_REGION matches your bucket region");
      console.log("4. Check IAM user permissions");
      console.log("5. Verify bucket policy allows public read access");
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    console.log("\n🔍 Common issues:");
    console.log("1. Missing environment variables");
    console.log("2. Invalid AWS credentials");
    console.log("3. Network connectivity issues");
    console.log("4. S3 bucket doesn't exist");
  }
}

// Run test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testS3Connection();
}

export { testS3Connection };
