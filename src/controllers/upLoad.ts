import cloudinary from "../configs/cloudinaryConfig";
import express from "express";
import fs from "fs";
import { MessageModel } from "../models/messages";
import { PostModel } from "../models/posts";
import { UserModel } from "../models/users";

export const upLoadImage = async (
  // chỉ sử dụng sau khi các post/message/... đã được tạo thì sẽ gọi api này để UPDATE
  req: express.Request,
  res: express.Response
) => {
  try {
    const { type, id } = req.body; // được xử lý bởi express như bình thường
    if (!type || !id) {
      res.status(400).json({ message: "Missing type or id" });
      return;
    }

    if (!req.file) {
      //req.file chứa file thực tế được xử lý bởi multer.
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Upload file lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    if (!result) {
      res.status(400).json({ message: "No result uploaded" });
      return;
    }

    // Xóa file tạm sau khi upload thành công
    fs.unlinkSync(req.file.path);

    switch (type) {
      case "avatar":
        const user = await UserModel.findByIdAndUpdate(
          id, // userId
          { avatar: result.secure_url },
          { new: true }
        );
        if (!user) {
          res.status(400).json({ message: "Update avatar image fail" });
          return;
        }
        break;
      case "post":
        const post = await PostModel.findByIdAndUpdate(
          id, // postId
          { mediaUrl: result.secure_url },
          { new: true }
        );
        if (!post) {
          res.status(400).json({ message: "Update post image fail" });
          return;
        }
        break;
      case "message":
        const messageContent = await MessageModel.findByIdAndUpdate(
          id, // messageId
          { mediaUrl: result.secure_url },
          { new: true }
        );
        if (!messageContent) {
          res.status(400).json({ message: "Update message image fail" });
          return;
        }
        break;
    }

    res.status(200).json({
      message: "Upload success",
      imageUrl: result.secure_url,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};
