import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }],
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model("Comment", CommentSchema);
