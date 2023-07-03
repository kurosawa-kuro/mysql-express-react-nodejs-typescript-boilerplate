// backend\database\prisma\seed\createPostTags.ts

import { Post, Tag, Prisma } from "@prisma/client";
import { db } from "../prismaClient";

export async function createPostTags(postEntities: Post[], tagEntities: Tag[]) {
  const postTags: Prisma.TagsOnPostsCreateInput[] = [
    {
      post: { connect: { id: postEntities[0].id } },
      tag: { connect: { id: tagEntities[0].id } },
    },
    {
      post: { connect: { id: postEntities[0].id } },
      tag: { connect: { id: tagEntities[1].id } },
    },
    {
      post: { connect: { id: postEntities[1].id } },
      tag: { connect: { id: tagEntities[1].id } },
    },
    // ... add more tags on posts as needed
  ];

  await Promise.all(
    postTags.map((postTag) => {
      const { post, tag } = postTag;
      return db.tagsOnPosts.create({
        data: {
          post,
          tag,
        },
      });
    })
  );

  return await db.tagsOnPosts.findMany();
}
