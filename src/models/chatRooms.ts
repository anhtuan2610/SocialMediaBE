import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    isGroup: { type: Boolean, default: false },
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ChatRoomModel = mongoose.model("ChatRoom", ChatRoomSchema);
