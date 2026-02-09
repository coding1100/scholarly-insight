import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(
  fileBuffer: Buffer
): Promise<{ publicId: string; fileUrl: string } | null> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "scholarlyhelp",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("No result from Cloudinary upload"));
          return;
        }
        resolve({
          publicId: result.public_id,
          fileUrl: result.secure_url,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}
