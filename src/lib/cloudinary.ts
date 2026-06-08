import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export interface UploadResult {
  secure_url: string;
  public_id: string;
  format: string;
}

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = 'grasag-upsa/questions'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'raw', // Use raw for PDF, DOCX
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Cloudinary upload returned empty result'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format
        });
      }
    ).end(fileBuffer);
  });
};

export default cloudinary;
