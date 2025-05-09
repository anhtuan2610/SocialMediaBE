import { authenticateToken } from "../middlewares";
import { createMessage, getAllMessageByRoomId } from "../controllers/messages";
import express from "express";

export default (router: express.Router): void => {
  router.post("/messages/create-message", authenticateToken, createMessage);
  router.get(
    "/messages/get-all-message/:roomId",
    authenticateToken,
    getAllMessageByRoomId
  );
};
