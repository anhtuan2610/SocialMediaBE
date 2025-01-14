import { authenticateToken } from "../middlewares";
import { createMessage, getAllMessageByRoomId } from "../controllers/messages";
import express from "express";

export default (router: express.Router): void => {
  router.use(authenticateToken);
  router.post("/messages/create-message", createMessage);
  router.get("/messages/get-all-message/:roomId", getAllMessageByRoomId);
};
