// backend\database\prisma\seed\getTagsOfSpecificPost.ts

import { Post } from "@prisma/client";
import { db } from "../prismaClient";
import { PostWithUserAndTags } from "../../../interfaces";

export async function getTagsOfSpecificPost(
  postEntities: Post[]
): Promise<PostWithUserAndTags | null> {
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
    return null;
  }

  return {
    id: specificPostTags.id,
    image: specificPostTags.image,
    description: specificPostTags.description,
    user: {
      id: specificPostTags.user.id,
      name: specificPostTags.user.name,
      email: specificPostTags.user.email,
      isAdmin: specificPostTags.user.isAdmin,
    },
    tags: specificPostTags.tagsOnPosts.map((tagOnPost) => tagOnPost.tag),
    createdAt: specificPostTags.createdAt,
    updatedAt: specificPostTags.updatedAt,
  };
}
