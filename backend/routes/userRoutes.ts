// backend\routes\userRoutes.ts

// External Imports
import express from "express";

// Internal Imports
import {
  readUserById,
  readUsers,
  readUserPosts,
  updateUserByAdminOnly,
  updateUserProfile,
  updateUserProfilePassword,
  deleteUserAdminOnly,
  createFollow,
  deleteFollow,
} from "../controllers/userController";
import { admin, protect } from "../middleware/authMiddleware";

export const router = express.Router();

// Route to update a user's profile
router.route("/profile").put(protect, updateUserProfile);

// Route to update a user's password
router.route("/profile/password").put(protect, updateUserProfilePassword);

// Route to get a list of users (Admin access only)
router.route("/").get(protect, readUsers);

// Route to get, update, and delete a user's data (Admin access only)
router
  .route("/:id")
  .get(protect, readUserById)
  .put(protect, admin, updateUserByAdminOnly)
  .delete(protect, admin, deleteUserAdminOnly);

router.route("/:id/posts").get(protect, readUserPosts);

// Route to follow/unfollow a user
router
  .route("/follow/:id")
  .post(protect, createFollow)
  .delete(protect, deleteFollow);
