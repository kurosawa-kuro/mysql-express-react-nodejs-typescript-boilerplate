// backend\models\postModel.ts

import { db } from "../database/prisma/prismaClient";
import { Prisma, Post } from "@prisma/client";
import { UserRequest } from "../interfaces";
import { UserInfo } from "os";

export const createPostInDB = async (
  userId: number,
  description: string
): Promise<Post | null> => {
  const userExists = await db.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error("User does not exist");
  }

  const data: Prisma.PostCreateInput = {
    user: { connect: { id: userId } },
    description,
  };

  return db.post.create({ data });
};
