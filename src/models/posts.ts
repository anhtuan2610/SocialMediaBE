import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, require: true },
    mediaUrl: { type: String, default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const PostModel = mongoose.model("Post", PostSchema);
