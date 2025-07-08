import express from "express";
import { createPost, getHomePosts, getPostById, getPostsByUser } from "../controllers/posts";
import { authenticateToken, uploadImageMiddleware } from "../middlewares";

export const PostRouter = (router: express.Router) => {
    router.post("/posts/create-post/:userId", authenticateToken, uploadImageMiddleware, createPost);
    router.get("/posts/get-posts-by-user/:userId", authenticateToken, getPostsByUser);
    router.get("/posts/get-post-by-id/:postId", authenticateToken, getPostById);
    router.get("/posts/get-home-posts", authenticateToken, getHomePosts);
}
