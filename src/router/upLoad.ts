import { upLoadImage } from "../controllers/upLoad";
import express from "express";
import { authenticateToken } from "../middlewares";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export default (router: express.Router): void => {
  router.post(
    "/upload/uploadImage",
    authenticateToken,
    upload.single("image"),
    upLoadImage
  ); // trung gian lưu ảnh vào thư mục tạm thời uploads (có thể chọn các cách lưu tạm thời khác nhau)
};
