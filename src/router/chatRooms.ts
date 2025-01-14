import express from "express";
import {
  createChatRoom,
  getAllChatRoomByUserId,
  getChatRoomInfo,
} from "../controllers/chatRooms";
import { authenticateToken } from "../middlewares";

export default (router: express.Router): void => {
  router.use(authenticateToken);
  router.get("/chatRooms/get-all-room", getAllChatRoomByUserId);
  router.post("/chatRooms/create-room", createChatRoom);
  router.get("/chatRooms/get-room-information/:id", getChatRoomInfo);
};
