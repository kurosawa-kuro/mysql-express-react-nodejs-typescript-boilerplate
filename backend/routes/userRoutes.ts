// backend\routes\userRoutes.ts

// External Imports
import express from "express";

// Internal Imports
import {
  registerUser,
  readUserById,
  readUserProfile,
  readUsers,
  loginUser,
  updateUserByAdminOnly,
  updateUserProfile,
  updateUserProfilePassword,
  logoutUser,
  deleteUserAdminOnly,
} from "../controllers/userController";
import { admin, protect } from "../middleware/authMiddleware";

export const router = express.Router();

// User Registration, Login, and Logout Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// User Profile Routes (Get and Update)
router
  .route("/profile")
  .get(protect, readUserProfile)
  .put(protect, updateUserProfile);

router.route("/profile/password").put(protect, updateUserProfilePassword);

// User Management and Users List Routes (Admin Access Only)
router
  .route("/:id")
  .get(protect, admin, readUserById)
  .put(protect, admin, updateUserByAdminOnly)
  .delete(protect, admin, deleteUserAdminOnly);

router.route("/").get(protect, readUsers);
