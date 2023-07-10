// backend\controllers\userController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../../backend/database/prisma/prismaClient";

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
  async (req: UserRequest, res: Response) => {
    const user = req.user;
    const description = req.body.description;

    if (user) {
      const id = user.id;
      const newPost = await db.post.create({
        data: {
          user: { connect: { id } },
          description,
        },
      });

      res.status(201).json(newPost);
    }
  }
);

// READ
export const readPosts = asyncHandler(
  async (req: UserRequest, res: Response) => {}
);

export const readPost = asyncHandler(
  async (req: UserRequest, res: Response) => {}
);