import cloudinary from "../configs/cloudinary.js";

export const uploadResumeToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw", // PDFs ke liye MUST
        format: "pdf"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(file.buffer);
  });
};