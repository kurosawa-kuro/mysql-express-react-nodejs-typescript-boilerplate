// backend\database\prisma\seed\createFollows.ts

import { User } from "@prisma/client";
import { db } from "../prismaClient";

export async function createUsersAndFollows() {
  const data = Array.from({ length: 7 }, (_, i) => {
    const userNumber = i + 3;
    return {
      email: `user${userNumber}@email.com`,
      name: `User${userNumber}`,
      password: "123456",
    };
  });

  await db.user.createMany({
    data,
  });

  const users: User[] = await db.user.findMany();

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
    {
      follower: {
        connect: {
          id: users[1].id,
        },
      },
      followee: {
        connect: {
          id: users[3].id,
        },
      },
    },
    {
      follower: {
        connect: {
          id: users[1].id,
        },
      },
      followee: {
        connect: {
          id: users[4].id,
        },
      },
    },
    {
      follower: {
        connect: {
          id: users[2].id,
        },
      },
      followee: {
        connect: {
          id: users[1].id,
        },
      },
    },
    {
      follower: {
        connect: {
          id: users[2].id,
        },
      },
      followee: {
        connect: {
          id: users[3].id,
        },
      },
    },
    {
      follower: {
        connect: {
          id: users[3].id,
        },
      },
      followee: {
        connect: {
          id: users[4].id,
        },
      },
    },
  ];

  await Promise.all(
    follows.map((follow) => {
      return db.follow.create({
        data: follow,
      });
    })
  );

  return await db.follow.findMany();
}
