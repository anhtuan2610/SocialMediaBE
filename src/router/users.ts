import express from "express"

import { getLoggedInUserInfo } from "../controllers/users"
import { authenticateToken } from "../middlewares/index";

export default (router: express.Router): void => {
    router.get("/users/get-info", authenticateToken, getLoggedInUserInfo);
}
