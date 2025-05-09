import express from "express";

import { getLoggedInUserInfo, getProfileInfo } from "../controllers/users";
import { authenticateToken } from "../middlewares/index";

export default (router: express.Router): void => {
  router.get("/users/get-info", authenticateToken, getLoggedInUserInfo);
  router.get(
    "/users/get-profile-info/:userId",
    authenticateToken,
    getProfileInfo
  );
};
