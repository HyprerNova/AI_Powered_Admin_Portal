import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Upload file to S3
export async function uploadToS3(file, fileName, contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: contentType,
      // ACL removed - bucket policy will handle public access
    });

    const result = await s3Client.send(command);
    return {
      success: true,
      key: fileName,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`,
      etag: result.ETag,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Delete file from S3
export async function deleteFromS3(fileKey) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('S3 delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate presigned URL for file access
export async function generatePresignedUrl(fileKey, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return {
      success: true,
      url: presignedUrl,
    };
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate unique filename with timestamp
export function generateFileName(originalName, prefix = '') {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  const fileName = `${prefix}${timestamp}_${randomString}.${extension}`;
  return fileName;
}

// Get file key from URL (for deletion purposes)
export function getFileKeyFromUrl(url) {
  if (!url) return null;
  
  // Handle both S3 URLs and relative paths
  if (url.includes('amazonaws.com')) {
    const urlParts = url.split('.com/');
    return urlParts[1];
  }
  
  // Handle relative paths (for backward compatibility)
  if (url.startsWith('/uploads/')) {
    return url.replace('/uploads/', '');
  }
  
  return url;
}
