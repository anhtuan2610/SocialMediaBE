import mongoose from "mongoose";
import { UserModel } from "../models/users";
import { PostModel } from "../models/posts";
import { CommentModel } from "../models/comments";

const initDb = async () => {
    try {
        // Kết nối database
        await mongoose.connect("mongodb://localhost:27017/your_database_name");
        console.log("Connected to MongoDB");

        // Tạo user mẫu
        const user = await UserModel.create({
            username: "testuser",
            email: "test@example.com",
            password: "password123",
            avatar: "default-avatar.jpg"
        });

        // Tạo post mẫu
        const post = await PostModel.create({
            author: user._id,
            content: "This is a sample post",
            title: "Sample Post",
            mediaUrl: "sample-image.jpg",
            location: "Sample Location"
        });

        // Tạo comment mẫu
        await CommentModel.create({
            author: user._id,
            post: post._id,
            content: "This is a sample comment"
        });

        console.log("Sample data created successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
};

initDb(); 