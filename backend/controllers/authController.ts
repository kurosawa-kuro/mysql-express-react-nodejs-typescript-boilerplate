// backend\controllers\authController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Imports
import { generateToken, hashPassword } from "../utils";
import {
  createUserInDB,
  readUserByEmailInDB,
  comparePassword,
} from "../models/userModel";
import { UserRequest, UserInfo } from "../interfaces";
import { Prisma } from "@prisma/client";

const _sanitizeUser = (user: any): UserInfo => {
  const { password, ...UserBase } = user;
  return UserBase;
};

// CREATE
export const registerUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { name, email, password } = req.body;

    if (!password || !name || !email) {
      res.status(400);
      throw new Error("Invalid user data");
    }

    const userExists = await readUserByEmailInDB(email);

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);
    const user: Prisma.UserCreateInput = {
      name,
      email,
      password: hashedPassword,
    };
    const createdUser = await createUserInDB(user);

    if (createdUser) {
      generateToken(res, createdUser.id);
      res.status(201).json(_sanitizeUser(createdUser));
    }
  }
);

// READ
export const loginUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { email, password } = req.body;
    const user = await readUserByEmailInDB(email);

    if (user && (await comparePassword(password, user.password))) {
      generateToken(res, user.id);
      res.json(_sanitizeUser(user));
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
);

// DELETE
export const logoutUser = (req: UserRequest, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
