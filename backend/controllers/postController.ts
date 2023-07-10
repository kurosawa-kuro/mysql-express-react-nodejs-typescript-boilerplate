// backend\controllers\userController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Imports
// import {
//   createUserInDB,
//   readUsersFromDB,
//   readUserByEmailInDB,
//   readUserByIdInDB,
//   updateUserByIdInDB,
//   deleteUserByIdInDB,
//   comparePassword,
// } from "../models/userModel";
// import { UserRequest, UserInfo } from "../interfaces";
import { Prisma } from "@prisma/client";
import { UserRequest } from "../interfaces";

// CREATE
export const createPost = asyncHandler(
  async (req: UserRequest, res: Response) => {}
);

// READ
export const readPosts = asyncHandler(
  async (req: UserRequest, res: Response) => {}
);

export const readPost = asyncHandler(
  async (req: UserRequest, res: Response) => {}
);
