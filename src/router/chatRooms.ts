import express from "express";
import {
  createChatRoom,
  getAllChatRoomByUserId,
  getChatRoomId,
  getChatRoomInfo,
} from "../controllers/chatRooms";
import { authenticateToken } from "../middlewares";

export default (router: express.Router): void => {
  router.get(
    "/chatRooms/get-all-room",
    authenticateToken,
    getAllChatRoomByUserId
  );
  router.post("/chatRooms/create-room", authenticateToken, createChatRoom);
  router.get(
    "/chatRooms/get-room-information/:id",
    authenticateToken,
    getChatRoomInfo
  );
  router.get("/chatRooms/get-roomId", authenticateToken, getChatRoomId);
};
