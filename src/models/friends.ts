import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    status: { type: String, enum: ["pending", "accept"], default: "pending" },
  },
  { timestamps: true }
);

export const FriendModel = mongoose.model("Friend", FriendSchema);
