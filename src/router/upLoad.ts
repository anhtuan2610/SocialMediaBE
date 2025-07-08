import {
  uploadAvatar,
  uploadPostImage,
  uploadMessageImage,
  createPostWithImage,
  createMessageWithImage,
} from "../controllers/upLoad";
import express from "express";
import { authenticateToken, uploadImageMiddleware } from "../middlewares";

export default (router: express.Router): void => {
  // Upload avatar cho user
  router.post(
    "/upload/avatar",
    authenticateToken,
    uploadImageMiddleware,
    uploadAvatar
  );

  // Tạo post với ảnh (mới)
  router.post(
    "/upload/create-post-with-image",
    authenticateToken,
    uploadImageMiddleware,
    createPostWithImage
  );

  // Tạo message với ảnh (mới)
  router.post(
    "/upload/create-message-with-image",
    authenticateToken,
    uploadImageMiddleware,
    createMessageWithImage
  );
};
