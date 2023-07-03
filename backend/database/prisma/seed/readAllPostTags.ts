// backend\database\prisma\seed\readAllPostTags.ts

import { db } from "../prismaClient";

export async function readAllPostTags() {
  return await db.tagsOnPosts.findMany({
    include: {
      post: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isAdmin: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      tag: true,
    },
  });
}
