// backend\database\prisma\seed\main.ts

import { db } from "../prismaClient";
import { clearDatabase } from "./clearDatabase";
import { createUsers } from "./createUsers";
import { createPosts } from "./createPosts";
import { createTags } from "./createTags";
import { createPostTags } from "./createPostTags";
import { readAllPostTags } from "./readAllPostTags";
import { readSpecificPostTags } from "./readSpecificPostTags";
import { readSpecificTagPosts } from "./readSpecificTagPosts";
import { createFollows } from "./createFollows";

async function main() {
  try {
    console.log("main.js clearDatabase()");
    await clearDatabase();

    console.log("main.js createUsers()");
    const userEntities = await createUsers();
    console.log("main.js createUsers() userEntities:", userEntities);

    console.log("main.js createPosts()");
    const postEntities = await createPosts(userEntities);
    console.log("main.js createPosts() postEntities:", postEntities);

    console.log("main.js createTags()");
    const tagEntities = await createTags();
    console.log("main.js createTags() tagEntities:", tagEntities);

    console.log("main.js createPostTags()");
    const postTagEntities = await createPostTags(postEntities, tagEntities);
    console.log("main.js createPostTags() postTagEntities:", postTagEntities);

    console.log("main.js createFollows()");
    const followsEntities = await createFollows();
    console.log("main.js createFollows() followsEntities:", followsEntities);

    console.log("main.js readAllPostTags()");
    const allPostTags = await readAllPostTags();
    console.log("main.js readAllPostTags() allPostTags:");
    console.dir(allPostTags, { depth: null });

    // 特定のPostからTagを取得する
    console.log("main.js readSpecificPostTags()");
    const specificPostTags = await readSpecificPostTags(postEntities);
    console.log("main.js readSpecificPostTags() specificPostTags:");
    console.dir(specificPostTags, { depth: null });

    // Todo:特定のTagからPostを取得する
    console.log("main.js readSpecificPostTags()");
    const specificTagPosts = await readSpecificTagPosts(tagEntities);
    console.log("main.js readSpecificTagPosts() specificTagPosts:");
    console.dir(specificTagPosts, { depth: null });
  } catch (error: any) {
    console.error("error.message", error.meta);
  }
}

main()
  .catch((error: any) => {
    console.log("error", error);
    console.error("error.message", error.meta);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
