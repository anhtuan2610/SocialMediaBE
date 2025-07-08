import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, require: false },
    content: { type: String, require: true },
    mediaUrl: { type: String, require: false },
    location: { type: String, require: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }], 
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: false }],
  },
  { timestamps: true }
);

export const PostModel = mongoose.model("Post", PostSchema);
