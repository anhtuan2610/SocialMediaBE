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

    // Lưu thông tin giải mã vào req để sử dụng trong các handler
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send("Invalid or Expired Access Token!");
  }
};
