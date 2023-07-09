// backend\database\prisma\seed\createFollows.ts

import { Prisma, User } from "@prisma/client";
import { db } from "../prismaClient";

export async function createFollows() {
  // create many users
  const users: User[] = await db.user.findMany();
  console.log({ users });

  const follows = [
    {
      follower: {
        connect: {
          id: users[1].id,
        },
      },
      followee: {
        connect: {
          id: users[2].id,
        },
      },
    },
  ];
  console.log("follows", follows);

  // const follow: Prisma.FollowCreateInput = {
  //   follower: {
  //     connect: {
  //       id: users[1].id,
  //     },
  //   },
  //   followee: {
  //     connect: {
  //       id: users[2].id,
  //     },
  //   },
  // };

  await Promise.all(
    follows.map((follow) => {
      return db.follow.create({
        data: follow,
      });
    })
  );

  // try {
  //   const res = await db.follow.create({
  //     data: follow,
  //   });
  //   console.log("res", res);
  // } catch (error) {
  //   console.log("error", error);
  // }

  return await db.follow.findMany();
}
