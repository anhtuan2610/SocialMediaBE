import cloudinary from "../configs/cloudinaryConfig";
import express from "express";
import fs from "fs";

export const upLoadImage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Upload file lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    // Xóa file tạm sau khi upload thành công
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Upload thành công",
      imageUrl: result.secure_url,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
