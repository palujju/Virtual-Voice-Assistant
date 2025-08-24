import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    // Ensure absolute path
    const absolutePath = path.resolve(filePath);

    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(absolutePath);

    // Remove file from local storage after upload
    fs.unlinkSync(absolutePath);

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error("Cloudinary Upload Failed");
  }
};

export default uploadOnCloudinary;
