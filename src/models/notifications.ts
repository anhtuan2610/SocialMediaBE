import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "addFriend"],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // lưu trữ ID của bài viết, bình luận hoặc người theo dõi, giúp dễ dàng điều hướng.
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model(
  "Notification",
  NotificationSchema
);
