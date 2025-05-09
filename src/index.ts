import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router"; // Nếu bạn import từ một thư mục mà không chỉ định tệp, Node.js sẽ mặc định tìm tệp index trong thư mục đó
import dotenv from "dotenv";
import { configureSocket } from "./socket/socket";

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
configureSocket(server);

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://animals26102002:26102002@cluster0.kudat.mongodb.net/SocialMediaDb?retryWrites=true&w=majority&appName=Cluster0";

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

mongoose.Promise = Promise;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch((error: Error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/api", router());

export default app;
