// backend\controllers\userController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Imports
import { generateToken, hashPassword } from "../utils";
import {
  createUserInDB,
  readUsersFromDB,
  readUserByEmailInDB,
  readUserByIdInDB,
  updateUserByIdInDB,
  deleteUserByIdInDB,
  comparePassword,
} from "../models/userModel";
import { UserRequest, UserInfo } from "../interfaces";
import { Prisma } from "@prisma/client";
import { db } from "../database/prisma/prismaClient";

const _sanitizeUser = (user: any): UserInfo => {
  const { password, ...UserBase } = user;
  return UserBase;
};

const _sanitizeAvatarPath = (path: string) => {
  return path ? path.replace(/\\/g, "/").replace("/frontend/public", "") : "";
};

// CREATE
export const createFollow = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const followerId = parseInt(req.params.id as string, 10);
    const { user } = req;

    if (user) {
      const followeeId = user.id;
      const newFollow = await db.follow.create({
        data: {
          follower: {
            connect: { id: followerId },
          },
          followee: {
            connect: { id: followeeId },
          },
        },
      });

      res.status(201).json(newFollow);
    }
  }
);

// READ
export const readUsers = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const users = await readUsersFromDB();
    res.json(users.map((user) => _sanitizeUser(user)));
  }
);

export const readUserById = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const id = Number(req.params.id);
    const reqUserId = req.user!.id;
    const user = await readUserByIdInDB(id, reqUserId!);

    if (user) {
      res.json(_sanitizeUser(user));
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

export const readUserPosts = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const paramId = Number(req.params.id);
    const loggedInUserId = req.user?.id;

    const user = await db.user.findUnique({
      where: {
        id: paramId,
      },
      include: {
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarPath: true,
              },
            },
          },
        },
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
        _count: {
          select: { followedBy: true, following: true },
        },
      },
    });

    if (user) {
      const isFollowed = user.followedBy.some(
        (followee) => followee.followee.id === loggedInUserId
      );

      const followerCount = user._count?.followedBy ?? 0;
      const followeeCount = user._count?.following ?? 0;

      const userData = { ...user, isFollowed, followerCount, followeeCount };

      res.status(200).json({
        user: userData,
        posts: user.posts,
      });
    }
  }
);

// UPDATE
export const updateUserProfile = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (req.user && req.user.id) {
      const id = req.user.id;
      const user = await readUserByIdInDB(id, id);

      if (user) {
        let avatarPath = _sanitizeAvatarPath(req.body.avatarPath);
        const updatedUser = await updateUserByIdInDB(id, {
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          avatarPath: avatarPath || user.avatarPath,
        });
        res.json(_sanitizeUser(updatedUser));
      }
    }
  }
);

export const updateUserProfilePassword = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (req.body.password !== req.body.confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    if (req.user && req.user.id) {
      const id = req.user.id;
      const user = await readUserByIdInDB(id, id);

      if (user) {
        const updatedUser = await updateUserByIdInDB(id, {
          password: await hashPassword(req.body.newPassword),
        });
        res.json(_sanitizeUser(updatedUser));
      }
    }
  }
);

export const updateUserByAdminOnly = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await readUserByIdInDB(id, id);

    if (user) {
      const updatedUser = await updateUserByIdInDB(id, {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        isAdmin: Boolean(req.body.isAdmin),
      });

      res.json(_sanitizeUser(updatedUser));
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

// DELETE
export const deleteUserAdminOnly = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await readUserByIdInDB(id, id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Can not delete admin user");
      }

      await deleteUserByIdInDB(id);
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

export const deleteFollow = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const followerId = parseInt(req.params.id as string, 10);
    const { user } = req;

    if (user) {
      const followeeId = user.id;

      const follow = await db.follow.findFirst({
        where: {
          AND: [{ followerId }, { followeeId }],
        },
      });

      if (follow) {
        await db.follow.delete({
          where: {
            id: follow.id,
          },
        });
      }

      res.status(201).json({ message: "Follow deleted" });
    }
  }
);
