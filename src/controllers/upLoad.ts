import cloudinary from "../configs/cloudinaryConfig";
import express from "express";
import fs from "fs";
import { MessageModel } from "../models/messages";
import { PostModel } from "../models/posts";
import { UserModel } from "../models/users";

// Type cho request với uploadResult và user
type CustomRequest = express.Request & {
  uploadResult?: {
    secure_url: string;
    public_id: string;
  };
  user?: {
    id: string;
    email: string;
  };
};

// Upload avatar cho user
export const uploadAvatar = async (
  req: CustomRequest,
  res: express.Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: "User ID not found in token" });
      return;
    }

    if (!req.uploadResult) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    // Cập nhật avatar cho user
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: req.uploadResult.secure_url },
      { new: true }
    );

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Avatar uploaded successfully",
      imageUrl: req.uploadResult.secure_url,
      user: {
        id: user._id,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Tạo post với ảnh
export const createPostWithImage = async (
  req: CustomRequest,
  res: express.Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { content, title, location } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID not found in token" });
      return;
    }

    if (!content) {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    // Tạo post data
    const postData: any = {
      author: userId,
      content,
      mediaUrl: req.uploadResult?.secure_url || null
    };

    if (title) postData.title = title;
    if (location) postData.location = location;

    // Tạo post mới
    const newPost = await PostModel.create(postData);

    res.status(201).json({
      message: "Post created successfully",
      post: {
        id: newPost._id,
        content: newPost.content,
        title: newPost.title,
        mediaUrl: newPost.mediaUrl,
        location: newPost.location,
        author: newPost.author,
        createdAt: newPost.createdAt
      }
    });
  } catch (error) {
    console.error("Create post with image error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Tạo message với ảnh
export const createMessageWithImage = async (
  req: CustomRequest,
  res: express.Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { content, chatRoomId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID not found in token" });
      return;
    }

    if (!content) {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    if (!chatRoomId) {
      res.status(400).json({ message: "Chat room ID is required" });
      return;
    }

    // Tạo message data
    const messageData: any = {
      sender: userId,
      content,
      chatRoom: chatRoomId,
      messageType: req.uploadResult ? "image" : "text",
      mediaUrl: req.uploadResult?.secure_url || null
    };

    // Tạo message mới
    const newMessage = await MessageModel.create(messageData);

    res.status(201).json({
      message: "Message created successfully",
      messageData: {
        id: newMessage._id,
        content: newMessage.content,
        mediaUrl: newMessage.mediaUrl,
        messageType: newMessage.messageType,
        sender: newMessage.sender,
        chatRoom: newMessage.chatRoom,
        createdAt: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error("Create message with image error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Upload ảnh cho post (cách cũ - cần postId)
export const uploadPostImage = async (
  req: CustomRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { postId } = req.body;

    if (!postId) {
      res.status(400).json({ message: "Missing postId" });
      return;
    }

    if (!req.uploadResult) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    // Cập nhật mediaUrl cho post
    const post = await PostModel.findByIdAndUpdate(
      postId,
      { mediaUrl: req.uploadResult.secure_url },
      { new: true }
    );

    if (!post) {
      res.status(400).json({ message: "Post not found" });
      return;
    }

    res.status(200).json({
      message: "Post image uploaded successfully",
      imageUrl: req.uploadResult.secure_url,
      post: {
        id: post._id,
        mediaUrl: post.mediaUrl
      }
    });
  } catch (error) {
    console.error("Upload post image error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Upload ảnh cho message (cách cũ - cần messageId)
export const uploadMessageImage = async (
  req: CustomRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      res.status(400).json({ message: "Missing messageId" });
      return;
    }

    if (!req.uploadResult) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    // Cập nhật mediaUrl cho message
    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      { 
        mediaUrl: req.uploadResult.secure_url,
        messageType: "image"
      },
      { new: true }
    );

    if (!message) {
      res.status(400).json({ message: "Message not found" });
      return;
    }

    res.status(200).json({
      message: "Message image uploaded successfully",
      imageUrl: req.uploadResult.secure_url,
      messageData: {
        id: message._id,
        mediaUrl: message.mediaUrl
      }
    });
  } catch (error) {
    console.error("Upload message image error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Giữ lại function cũ để tương thích ngược (nếu cần)
export const upLoadImage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { type, id } = req.body;
    if (!type || !id) {
      res.status(400).json({ message: "Missing type or id" });
      return;
    }

    if (!req.file) {
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
          id,
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
          id,
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
          id,
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
