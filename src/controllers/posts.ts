import express from "express";
import { PostModel } from "../models/posts";

// Mở rộng type Request để có thể truy cập uploadResult
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

export const createPost = async (req: CustomRequest, res: express.Response) => {
  const userId = req.user?.id;
  const { title, content, location } = req.body;

  if (!content || !title) {
    res.status(400).send("Missing some field.");
    return;
  }

  try {
    const newPost = await PostModel.create({
      author: userId,
      title,
      content,
      location,
      mediaUrl: req.uploadResult?.secure_url || null, // Sử dụng URL từ kết quả upload
    });

    if (!newPost) {
      res.status(400).send("Can't create post.");
      return;
    }

    res.status(200).json({
      message: "Create post success!",
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
};

export const getPostsByUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;
  const { skipPostCount, limit } = req.query;
  const skipNumber = parseInt(skipPostCount as string) || 0;
  const limitNumber = parseInt(limit as string) || 15;

  if (!userId) {
    res.status(400).send("Missing userId.");
    return;
  }

  const posts = await PostModel.find({ author: userId })
    .skip(skipNumber)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  if (!posts) {
    res.status(400).send("Can't get any posts by user.");
    return;
  }

  res.status(200).json({
    message: "Get all post success !",
    data: posts,
  });
  return;
};

export const getPostById = async (
  req: express.Request,
  res: express.Response
) => {
  const { postId } = req.params;
  if (!postId) {
    res.status(400).send("Missing postId.");
    return;
  }
  const post = await PostModel.findById(postId);
  if (!post) {
    res.status(400).send("Can't get post by id.");
    return;
  }
  res.status(200).json({
    message: "Get post by id success !",
    data: post,
  });
  return;
};

export const getHomePosts = async (
  req: express.Request,
  res: express.Response
) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("author");

    const totalPosts = await PostModel.countDocuments();

    res.status(200).json({
      message: "Get home posts success!",
      data: {
        posts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalPosts / Number(limit)),
        totalPosts,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching home posts",
      error: error.message,
    });
  }
};
