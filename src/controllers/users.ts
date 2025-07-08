import express from "express";
import { UserModel } from "../models/users";

type CustomRequest = express.Request & {
  user?: {
    id: string;
    email: string;
  };
  uploadResult?: {
    secure_url: string;
    public_id: string;
  };
};

export const getLoggedInUserInfo = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const id = req.user.id; // detected từ jwt ra (user: {email, id} nên phải custom lại kiểu req)
    if (!id) {
      res.status(400).send("User ID Not Found!");
      return;
    }

    const userInfo = await UserModel.findById(id);
    if (!userInfo) {
      res.status(404).send("User Not Found!");
      return;
    }

    res
      .status(200)
      .json({ message: "Find User Information Success !", data: { userInfo } });
    return;
  } catch (error) {
    res.status(500).send("An error occurred while fetching user info.");
    return;
  }
};

export const getProfileInfo = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).send("User ID Not Found!");
      return;
    }
    const info = await UserModel.findById(userId);
    if (!info) {
      res.status(400).send("User ID Not Found!");
      return;
    }
    console.log(info);

    res
      .status(200)
      .json({ message: "Get user information success !", data: { info } });
    return;
  } catch (error) {
    res.status(500).send("An error occurred while fetching user info.");
    return;
  }
};

export const updateUserInfo = async (
  req: CustomRequest,
  res: express.Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "User ID not found" });
      return;
    }

    const { fullName, bio } = req.body;
    const updateData: any = {};

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    // Nếu có uploadResult (tức là có upload avatar)
    if (req.uploadResult && req.uploadResult.secure_url) {
      updateData.avatar = req.uploadResult.secure_url;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user info error:", error);
    res.status(500).json({ error: error.message });
  }
};
