import express from "express";
import { MessageModel } from "../models/messages";
import { ChatRoomModel } from "../models/chatRooms";

export const createMessage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { senderId, content, chatRoomId } = req.body;
    if (!senderId || !content || !chatRoomId) {
      res.status(400).send("Missing some field.");
      return;
    }
    const newMessage = await MessageModel.create({
      sender: senderId,
      content,
      chatRoom: chatRoomId,
    });
    const chatRoom = await ChatRoomModel.findByIdAndUpdate(
      chatRoomId,
      {
        lastMessage: newMessage._id,
      },
      { new: true } // nếu không sử dụng new: true thì chương trình sẽ truy vấn lại data cũ (data trước khi được update)
    );
    if (!newMessage || !chatRoom) {
      res.status(400).send("Can't create message.");
    }
    res.status(200).json({
      message: "Create Message Success !",
      data: { newMessage, chatRoom },
    });
    return;
  } catch (error) {
    res.status(500).send("An error occurred while create message." + error);
    return;
  }
};

export const getAllMessageByRoomId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      res.status(400).send("Missing room id");
      return;
    }
    const listMessages = await MessageModel.find({ chatRoom: roomId }).select(
      "-chatRoom"
    );
    if (!listMessages) {
      res.status(404).send("Not found any message in chat room.");
      return;
    }
    res.status(200).json({
      message: "Get List Messages Success !",
      data: listMessages,
    });
    return;
  } catch (error) {
    res.status(500).send("An error occurred while get message." + error);
    return;
  }
};