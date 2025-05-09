import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
    mediaUrl: { type: String, default: null },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model("Message", MessageSchema);
