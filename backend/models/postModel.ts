// backend\models\postModel.ts

import { db } from "../database/prisma/prismaClient";
import { Prisma, Post } from "@prisma/client";
import { UserRequest } from "../interfaces";
import { UserInfo } from "os";

export const createPostInDB = async (
  user: any,
  description: string
): Promise<Post> => {
  const id = user.id;
  const data: Prisma.PostCreateInput = {
    user: { connect: { id } },
    description,
  };

  return db.post.create({ data });
};
