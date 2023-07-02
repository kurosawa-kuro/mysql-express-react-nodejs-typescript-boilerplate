import { User, Post, Tag, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "./prismaClient";

export async function getTagsOfSpecificPost(postEntities: Post[]) {
  const tagsOnPosts = await db.tagsOnPosts.findMany({
    where: {
      postId: postEntities[0].id,
    },
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

  type TagsOnPosts = {
    postId: number;
    tagId: number;
    createdAt: Date;
    updatedAt: Date;
    post: Post;
    tag: Tag[];
  };

  const initialAccumulator: Partial<TagsOnPosts> = {};
  const specificPostTags = tagsOnPosts.reduce(
    (acc: Partial<TagsOnPosts>, cur) => {
      if (!acc.postId) {
        acc = { ...cur, tag: [cur.tag] };
      } else {
        acc.tag?.push(cur.tag);
      }

      return acc;
    },
    initialAccumulator
  );

  return specificPostTags;
}
