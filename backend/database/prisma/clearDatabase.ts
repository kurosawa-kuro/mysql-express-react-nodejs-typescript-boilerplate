//

import { db } from "./prismaClient";

export async function clearDatabase() {
  await db.$executeRaw`SET FOREIGN_KEY_CHECKS=0;`;
  await db.$executeRaw`TRUNCATE TABLE TagsOnPosts;`;
  await db.$executeRaw`TRUNCATE TABLE Post;`;
  await db.$executeRaw`TRUNCATE TABLE Tag;`;
  await db.$executeRaw`TRUNCATE TABLE User;`;
  await db.$executeRaw`SET FOREIGN_KEY_CHECKS=1;`;
}
