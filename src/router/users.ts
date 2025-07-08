import express from "express";

import { getLoggedInUserInfo, getProfileInfo, updateUserInfo } from "../controllers/users";
import { authenticateToken, uploadImageMiddleware } from "../middlewares/index";

export default (router: express.Router): void => {
  router.get("/users/get-info", authenticateToken, getLoggedInUserInfo);
  router.get(
    "/users/get-profile-info/:userId",
    authenticateToken,
    getProfileInfo
  );
  router.put("/users/update-info", authenticateToken, uploadImageMiddleware, updateUserInfo);
};
