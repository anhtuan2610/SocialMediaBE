import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    avatar: { type: String, default: null },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
    bio: { type: String, default: null },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema); // Mongoose sẽ chuyển "User" thành "users" // collection(table) trong db sẽ có tên là users // collection sẽ được tạo nếu như trong db chưa có (được tạo khi thao tác ghi dữ liệu vào collection lần đầu tiên như create , save , insert)
