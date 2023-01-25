import express from 'express';
import { createPost, FetchAllPosts, FetchPost, DeletePost, LikePost } from '../controllers/post.js';
import UPLOAD from "../middlewares/post.js";
import auth from "../middlewares/auth.js";
import path from "path"

const router = express.Router();



router.post("/createPost", UPLOAD.single(path.join(__dirname, `../media`)), createPost);
router.get("/getAllPosts", FetchAllPosts);
router.get("/getSelectedPost/:id", auth, FetchPost);
router.delete("/deleteSelectedPost/:id", auth, DeletePost);
router.patch("/likePost/:id", auth, LikePost);

export default router;