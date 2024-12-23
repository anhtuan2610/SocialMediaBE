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
    const id = req.user.id;
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