import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

// Upload an image
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
      const Response=  await cloudinary.uploader.upload(localFilePath,{resource_type: "auto"})
        console.log('File is uploaded on cloudinary',Response.url);
        fs.unlink(localFilePath, (err) => {
          if (err) {
            console.error('Failed to delete local file:', err);
          }
        });
        return Response.url
    } catch (error) {
        console.log('Cloudinary error',error);

       
        fs.unlink(localFilePath, (err) => {
          if (err) {
            console.error('Failed to delete local file:', err);
          }
        })
        return null
    }
  
};
