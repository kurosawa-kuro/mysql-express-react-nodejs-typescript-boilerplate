// backend\database\prisma\seed\createPosts.ts

import { User, Prisma } from "@prisma/client";
import { db } from "../prismaClient";

export async function createPosts(userEntities: User[]) {
  const user = userEntities.filter((user) => !user.isAdmin);

  const posts: Prisma.PostCreateInput[] = [
    {
      user: { connect: { id: user[0].id } },
      imagePath: "image_url1",
      description: "post_description1",
    },
    {
      user: { connect: { id: user[0].id } },
      imagePath: "image_url2",
      description: "post_description2",
    },
    {
      user: { connect: { id: user[1].id } },
      imagePath: "image_url3",
      description: "post_description3",
    },
    // ... add more posts as needed
  ];

  await Promise.all(
    posts.map((post) => {
      const { user, imagePath, description } = post;
      return db.post.create({
        data: {
          user,
          imagePath,
          description,
        },
      });
    })
  );

  return await db.post.findMany();
}
