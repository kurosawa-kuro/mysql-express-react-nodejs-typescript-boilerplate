// backend\database\prisma\seed\createAndSavePosts.ts

import { User, Prisma } from "@prisma/client";
import { db } from "../prismaClient";

export async function createAndSavePosts(userEntities: User[]) {
  const user = userEntities.filter((user) => !user.isAdmin);

  const posts: Prisma.PostCreateInput[] = [
    {
      user: { connect: { id: user[0].id } },
      image_path: "image_url1",
      description: "post_description1",
    },
    {
      user: { connect: { id: user[0].id } },
      image_path: "image_url2",
      description: "post_description2",
    },
    {
      user: { connect: { id: user[1].id } },
      image_path: "image_url3",
      description: "post_description3",
    },
    // ... add more posts as needed
  ];

  await Promise.all(
    posts.map((post) => {
      const { user, image_path, description } = post;
      return db.post.create({
        data: {
          user,
          image_path,
          description,
        },
      });
    })
  );

  return await db.post.findMany();
}
