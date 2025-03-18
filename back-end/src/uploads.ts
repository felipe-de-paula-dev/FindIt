import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { format } from "mysql2";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, res: Response) => {
    console.log("Req body:", req.body);
    const folderName = req.body.folder == "user" ? "uploadsUser" : "uploads";
    console.log("Pasta: ", folderName);
    return {
      folder: folderName,
      public_id: `img_${Date.now()}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
