import jwt from "jsonwebtoken";
import express from "express";
import multer from "multer";
import cloudinary from "../configs/cloudinaryConfig";
import fs from "fs";

// Mở rộng type Request để thêm thuộc tính user và uploadResult
type CustomRequest = express.Request & {
  user?: {
    id: string;
    email: string;
  };
  uploadResult?: {
    secure_url: string;
    public_id: string;
  };
};

export const authenticateToken = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Invalid Authorization Header Format!");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send("Invalid or Expired Access Token!");
  }
};

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

export const uploadImageMiddleware = async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Xử lý form-data trước
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading file" });
      }

      // Nếu có file được upload
      if (req.file) {
        try {
          // Upload file lên Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "uploads",
          });

          // Xóa file tạm sau khi upload thành công
          fs.unlinkSync(req.file.path);

          // Lưu kết quả upload vào request
          req.uploadResult = {
            secure_url: result.secure_url,
            public_id: result.public_id,
          };
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Error uploading to Cloudinary" });
        }
      }

      // Tiếp tục xử lý request
      next();
    });
  } catch (error) {
    console.error("Middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
