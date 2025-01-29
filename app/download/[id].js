import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { redirect } from 'next/navigation';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function DownloadPage({ params }) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${params.id}/`,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour expiration
    });

    redirect(url);
  } catch (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-500">
          File not found or link expired
        </h1>
      </div>
    );
  }
}