// backend\models\userModel.ts

import { db } from "../database/prisma/prismaClient";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export const createUserInDB = async (data: Prisma.UserCreateInput) => {
  return await db.user.create({ data });
};

export const readUserByEmailInDB = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const readUsersFromDB = async () => {
  return await db.user.findMany();
};

export const readUserByIdInDB = async (id: number, loggedInUserId: number) => {
  const user = await db.user.findUnique({
    where: { id },
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

    return { ...user, isFollowed, followerCount, followeeCount };
  }

  return null;
};

export const updateUserByIdInDB = async (id: number, data: any) => {
  return await db.user.update({ where: { id }, data });
};

export const deleteUserByIdInDB = async (id: number) => {
  await db.follow.deleteMany({
    where: {
      OR: [{ followerId: id }, { followeeId: id }],
    },
  });

  return await db.user.delete({
    where: { id },
  });
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
