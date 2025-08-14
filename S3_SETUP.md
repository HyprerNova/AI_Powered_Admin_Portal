# S3 Bucket Setup Guide

This guide will help you set up AWS S3 bucket storage for images and marks cards in your admin portal.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured (optional but recommended)

## Step 1: Create S3 Bucket

1. Go to AWS S3 Console
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `adminportal-files-2024`)
4. Select your preferred region
5. Keep default settings for versioning and encryption
6. Click "Create bucket"

## Step 2: Configure Bucket Permissions

1. Select your bucket
2. Go to "Permissions" tab
3. Update the bucket policy to allow public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

4. Uncheck "Block all public access" (since we need public read access for files)

## Step 3: Create IAM User

1. Go to AWS IAM Console
2. Click "Users" → "Create user"
3. Give it a name (e.g., `adminportal-s3-user`)
4. Attach the `AmazonS3FullAccess` policy (or create a custom policy with minimal permissions)
5. Create access keys for this user

## Step 4: Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in your AWS credentials:

```bash
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=your_bucket_region
AWS_S3_BUCKET_NAME=your_bucket_name
```

## Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Try adding a new student with file uploads
3. Check your S3 bucket to see if files are uploaded

## File Structure in S3

Files will be organized with prefixes:
- `10th_marks_*` - 10th standard marks cards
- `12th_marks_*` - 12th standard marks cards
- `caste_cert_*` - Caste certificates
- `photo_*` - Student photos

## Security Considerations

1. **Public Read Access**: Files are publicly readable for easy access
2. **Access Control**: Only authenticated users can upload/delete files
3. **File Validation**: Consider implementing file type and size validation
4. **Lifecycle Policies**: Set up S3 lifecycle policies to automatically delete old files if needed

## Troubleshooting

### Common Issues:

1. **Access Denied**: Check IAM user permissions and bucket policy
2. **Region Mismatch**: Ensure AWS_REGION matches your bucket region
3. **Bucket Not Found**: Verify AWS_S3_BUCKET_NAME is correct
4. **CORS Issues**: If accessing from web, configure CORS on your bucket

### CORS Configuration (if needed):

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Migration from Local Storage

If you have existing files in the `public/uploads` directory:

1. Upload them to S3 manually or create a migration script
2. Update database records to point to S3 URLs
3. Remove the local uploads directory

## Cost Optimization

1. **Storage Class**: Use S3 Standard for frequently accessed files
2. **Lifecycle Policies**: Move old files to cheaper storage classes
3. **Monitoring**: Set up CloudWatch alerts for unexpected usage
