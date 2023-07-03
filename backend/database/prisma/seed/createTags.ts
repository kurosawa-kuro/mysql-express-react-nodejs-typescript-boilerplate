// backend\database\prisma\seed\createTags.ts

import { Prisma } from "@prisma/client";
import { db } from "../prismaClient";

export async function createTags() {
  const tags: Prisma.TagCreateInput[] = [
    {
      name: "Tag1",
    },
    {
      name: "Tag2",
    },
    {
      name: "Tag3",
    },
    // ... add more tags as needed
  ];

  await Promise.all(
    tags.map((tag) => {
      const { name } = tag;
      return db.tag.create({
        data: {
          name,
        },
      });
    })
  );

  return await db.tag.findMany();
}
