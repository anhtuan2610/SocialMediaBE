import express from "express";
import { authentication, random } from "../helpers";
import { UserModel } from "../models/users";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      res.status(400).send("Missing required fields !");
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).send("This email already exists !");
      return;
    }

    const salt = random();
    const user = await UserModel.create({
      email,
      fullName,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    res.status(200).json(user);
    return;
  } catch (error) {
    res.sendStatus(400);
    return;
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Missing required fields !");
      return;
    }

    const user = await UserModel.findOne({ email }).select(
      "+authentication.salt +authentication.password"
    ); // mongo chỉ trả ra các trường có select: true định nghĩa trong schema (mà passwod với salt đang để là select: false(trong users model) nên là phải dùng select('') để lấy ra nó)
    if (!user) {
      res.status(400).send("Email not found !");
      return;
    }

    const passwordHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== passwordHash) {
      res.status(400).send("Password is not correct !");
      return;
    }

    res.status(200).send("Login successful !");
  } catch (error) {
    res.sendStatus(400);
    return;
  }
};
