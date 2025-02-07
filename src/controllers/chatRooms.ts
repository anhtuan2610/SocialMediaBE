import express from "express";
import mongoose, { Types } from "mongoose";
import { ChatRoomModel } from "../models/chatRooms";
import { UserModel } from "../models/users";

type TMember = {
  _id: Types.ObjectId;
  fullName: string;
  avatar: string;
};

type CustomRequest = express.Request & {
  user?: {
    id: string;
    email: string;
  };
};

export const getAllChatRoomByUserId = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const id = req.user.id;
    const searchString = req.query.searchString?.toString() || "";
    if (!id) {
      res.status(400).send("User ID Missing.");
      return;
    }
    // Kiểm tra định dạng của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send("Invalid User ID format.");
      return;
    }
    const existUser = await UserModel.findOne({ _id: id });
    if (!existUser) {
      res.status(400).send("User Not Found.");
      return;
    }
    const listChatRooms = await ChatRoomModel.find({ members: id })
      .populate("members")
      .populate("lastMessage");
    if (!listChatRooms || listChatRooms.length === 0) {
      res.status(404).send("Not Found Any Chat Room.");
      return;
    }
    // Dùng any[] để bỏ qua kiểu kiểm tra
    listChatRooms.forEach((chatRoom: any) => {
      const otherMember = chatRoom.members.filter(
        (member: TMember) => member._id.toString() !== id
      )[0];
      if (otherMember) {
        chatRoom.name = otherMember.fullName;
      }
    });
    const filterChatRooms = listChatRooms.filter((chatRoom) =>
      chatRoom.name
        .toLocaleLowerCase()
        .includes(searchString.toLocaleLowerCase())
    );
    res.status(200).json({
      message: "Find All Chat Room Success.",
      data: filterChatRooms,
    });
  } catch (error) {
    res.status(500).send("An error occurred while fetching chat room.");
    return;
  }
};

export const createChatRoom = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { roomName, members } = req.body;
    if (!members || members.length < 2) {
      res
        .status(400)
        .send("At least 2 members are required for a conversation.");
      return;
    }
    const usersExist = await UserModel.find({ _id: { $in: members } }); // tìm user có trường id, nếu có giá trị trùng với giá trị trong members thì trả ra (trong members lấy được từ body) // đỡ phải duyệt mảng dữ liệu của member để tìm id khớp
    if (usersExist.length !== members.length) {
      res.status(400).send("Some members do not exist.");
      return;
    }
    const chatRoom = ChatRoomModel.create({
      members,
      name: roomName,
    });
    res.status(200).json(chatRoom);
    return;
  } catch (error) {
    res.status(500).send("An error occurred while create chat room.");
    return;
  }
};

export const getChatRoomInfo = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send("Not found chat room id.");
      return;
    }
    const chatRoom = await ChatRoomModel.findById(id)
      .populate("members")
      .select("name isGroup members lastActive");
    if (!chatRoom) {
      res.status(400).send("Not found chat room.");
      return;
    }
    res.status(200).json({
      message: "Get chat room information success.",
      data: chatRoom,
    });
    return;
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while fetch chat room information.");
    return;
  }
};

export const getChatRoomId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId1, userId2 } = req.query;
    if (!userId1 || !userId2) {
      res.status(400).send("Missing user id");
      return;
    }
    const chatRoom = await ChatRoomModel.findOne({
      members: { $all: [userId1, userId2] },
    });
    if (!chatRoom) {
      res.status(400).send("Not found chat room with room id");
      return;
    }
    res.status(200).json({
      message: "Get chat room success !",
      data: chatRoom._id,
    });
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while fetch chat room id information.");
    return;
  }
};
