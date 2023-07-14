// backend\controllers\userController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../../backend/database/prisma/prismaClient";

// Internal Imports
import { UserRequest } from "../interfaces";
import { createPostInDB } from "../models/postModel";

// CREATE
export const createPost = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const user = req.user;
    const description = req.body.description;

    if (user) {
      const newPost = await createPostInDB(user.id!, description);

      res.status(201).json(newPost);
    }
  }
);

// READ
export const readPosts = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const posts = await db.post.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json(posts);
  }
);

export const readPost = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const result = await db.post.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: {
          include: {
            followedBy: {
              select: {
                id: true,
                followee: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (result) {
      const isFollowed = result.user.followedBy.map((followee) => {
        if (followee.followee.id === req.user!.id) {
          return true;
        }
      });

      const response = {
        id: result.id,
        description: result.description,
        imagePath: result.imagePath,
        createdAt: result.createdAt,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          avatarPath: result.user.avatarPath,
          isAdmin: result.user.isAdmin,
          createdAt: result.user.createdAt,
          updatedAt: result.user.updatedAt,
        },
        isFollowed: isFollowed.some((followee) => followee === true),
      };

      res.status(200).json(response);
    }
  }
);
