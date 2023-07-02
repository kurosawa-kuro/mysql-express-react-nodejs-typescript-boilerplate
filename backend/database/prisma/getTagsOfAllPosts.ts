import { db } from "./prismaClient";

export async function getTagsOfAllPosts() {
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
