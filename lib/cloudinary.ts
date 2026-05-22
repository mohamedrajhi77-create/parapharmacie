import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  file: string,
  folder = "parapharmacie/products"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [
      { width: 800, height: 800, crop: "fill", quality: "auto", fetch_format: "auto" },
    ],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
