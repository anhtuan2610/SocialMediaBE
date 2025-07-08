import express from "express";
import { MessageModel } from "../models/messages";
import { ChatRoomModel } from "../models/chatRooms";

type CustomRequest = express.Request & {
  user?: {
    id: string;
    email: string;
  };
  uploadResult?: {
    secure_url: string;
    public_id: string;
  };
};

export const createMessage = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const userId = req.user?.id;
    const { content, chatRoomId } = req.body;
    if (!content && !req.uploadResult) {
      res.status(400).send("Missing content or image.");
      return;
    }
    if (!chatRoomId) {
      res.status(400).send("Missing chatRoomId.");
      return;
    }
    const messageData: any = {
      sender: userId,
      chatRoom: chatRoomId,
    };
    if (req.uploadResult) {
      messageData.mediaUrl = req.uploadResult.secure_url;
    }
    if (content) {
      messageData.content = content;
    }
    const newMessage = await MessageModel.create(messageData);
    const chatRoom = await ChatRoomModel.findByIdAndUpdate(
      chatRoomId,
      {
        lastMessage: newMessage._id,
      },
      { new: true }
    );
    if (!newMessage || !chatRoom) {
      res.status(400).send("Can't create message.");
      return;
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
    const { skipMessageCount, limit } = req.query;
    const skipNumber = parseInt(skipMessageCount as string) || 0;
    const limitNumber = parseInt(limit as string) || 15;
    if (!roomId) {
      res.status(400).send("Missing room id");
      return;
    }
    const totalMessage = await MessageModel.countDocuments({
      chatRoom: roomId,
    });
    const listMessages = await MessageModel.find({ chatRoom: roomId })
      .select("-chatRoom")
      .sort({ _id: -1 })
      .skip(skipNumber)
      .limit(limitNumber);
    if (!listMessages) {
      res.status(404).send("Not found any message in chat room.");
      return;
    }
    res.status(200).json({
      message: "Get List Messages Success !",
      data: {
        listMessages: listMessages.reverse(),
        totalMessage: totalMessage,
      },
    });
    return;
  } catch (error) {
    res.status(500).send("An error occurred while get message." + error);
    return;
  }
};
