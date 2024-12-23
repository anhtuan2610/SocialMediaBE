import jwt from "jsonwebtoken";
import express from "express";

// Mở rộng type Request để thêm thuộc tính user
type CustomRequest = express.Request & {
  user?: {
    id: string;
    email: string;
  };
};

export const authenticateToken = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header Authorization

  if (!token) {
    res.status(401).send("Access Token Missing!");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };

    // Lưu thông tin giải mã vào req để sử dụng trong các handler
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send("Invalid or Expired Access Token!");
  }
};
