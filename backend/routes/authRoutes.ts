// backend\routes\userRoutes.ts

// External Imports
import express from "express";

// Internal Imports
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController";
import { admin, protect } from "../middleware/authMiddleware";

export const router = express.Router();

// Route to register a new user
router.post("/register", registerUser);

// Route to log in an existing user
router.post("/login", loginUser);

// Route to log out a user
router.post("/logout", logoutUser);
