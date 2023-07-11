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
    console.log("check");
    const posts = await db.post.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // const posts = await db.post.findMany({
    //   include: {
    //     user: {
    //       include: {
    //         followedBy: {
    //           select: {
    //             id: true,
    //             follower: {
    //               select: {
    //                 name: true,
    //                 email: true,
    //               },
    //             },
    //             followee: {
    //               select: {
    //                 name: true,
    //                 email: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // console.log("posts", posts);
    console.dir(posts, { depth: null });
    res.status(200).json(posts);
  }
);

export const readMyPosts = asyncHandler(
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
    console.log("readPost");
    console.log("req.params.id", req.params.id);
    const result = await db.post.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: {
          include: {
            followedBy: {
              select: {
                id: true,
                // follower: {
                //   select: {
                //     id: true,
                //     name: true,
                //     email: true,
                //   },
                // },
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
    // console.log({ result });
    console.dir(result, { depth: null });
    if (result) {
      const isfollowed = result.user.followedBy.map((followee) => {
        if (followee.followee.id === req.user!.id) {
          return true;
        } else {
          return false;
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
        isfollowed: isfollowed.some((followee) => followee === true),
      };

      console.dir(response, { depth: null });
      res.status(200).json(response);
    }
  }
);
