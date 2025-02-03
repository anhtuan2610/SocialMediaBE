import express from "express";
import { UserModel } from "../models/users";

type CustomRequest = express.Request & {
  user?: {
    id: string;
    email: string;
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

export const getProfileInfo = async (req: express.Request, res: express.Response) => {
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
    
    res.status(200).json({ message: "Get user information success !", data: {info} });
    return;
  } catch (error) {
    res.status(500).send("An error occurred while fetching user info.");
    return;
  }
};
