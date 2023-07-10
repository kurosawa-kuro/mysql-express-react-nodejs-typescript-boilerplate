// backend\routes\userRoutes.ts

// External Imports
import express from "express";

// Internal Imports
import { createPost, readPosts, readPost } from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

export const router = express.Router();

// Post create, read,read single
router.post("/", protect, createPost);
router.get("/", protect, readPosts);
router.get("/:id", protect, readPost);
