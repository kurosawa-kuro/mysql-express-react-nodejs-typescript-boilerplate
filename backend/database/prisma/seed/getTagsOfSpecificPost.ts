// backend\database\prisma\seed\getTagsOfSpecificPost.ts

import { Post } from "@prisma/client";
import { db } from "../prismaClient";

export async function getTagsOfSpecificPost(postEntities: Post[]) {
  const specificPostTags = await db.post.findUnique({
    where: {
      id: postEntities[0].id,
    },
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
      tagsOnPosts: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!specificPostTags) {
    throw new Error("specificPostTags is null");
  }

  return {
    id: specificPostTags.id,
    userId: specificPostTags.userId,
    image: specificPostTags.image,
    description: specificPostTags.description,
    user: {
      id: specificPostTags.user.id,
      name: specificPostTags.user.name,
      email: specificPostTags.user.email,
      isAdmin: specificPostTags.user.isAdmin,
    },
    tags: specificPostTags.tagsOnPosts.map((tag) => {
      return {
        id: tag.tag.id,
        name: tag.tag.name,
        createdAt: tag.tag.createdAt,
        updatedAt: tag.tag.updatedAt,
      };
    }),
    createdAt: specificPostTags.createdAt,
    updatedAt: specificPostTags.updatedAt,
  };
}
