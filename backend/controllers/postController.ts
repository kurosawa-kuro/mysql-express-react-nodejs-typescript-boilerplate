// backend\controllers\userController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../../backend/database/prisma/prismaClient";

// Internal Imports
import { UserRequest } from "../interfaces";
import { Prisma } from "@prisma/client";

// CREATE
export const createPost = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const user = req.user;
    const description = req.body.description;

    if (user) {
      const id = user.id;
      const data: Prisma.PostCreateInput = {
        user: { connect: { id } },
        description,
      };
      const newPost = await db.post.create({
        data,
      });

      res.status(201).json(newPost);
    }
  }
);

// READ
export const readPosts = asyncHandler(
  async (req: UserRequest, res: Response) => {
    res.status(200).json(await db.post.findMany());
  }
);

export const readPost = asyncHandler(
  async (req: UserRequest, res: Response) => {
    res.status(200).json(
      await db.post.findUnique({
        where: { id: Number(req.params.id) },
      })
    );
  }
);
