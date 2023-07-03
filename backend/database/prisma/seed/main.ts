// backend\database\prisma\seed\main.ts

import { db } from "../prismaClient";
import { clearDatabase } from "./clearDatabase";
import { createAndSaveUsers } from "./createAndSaveUsers";
import { createAndSavePosts } from "./createAndSavePosts";
import { createAndSaveTags } from "./createAndSaveTags";
import { createAndSavePostTags } from "./createAndSavePostTags";
import { getTagsOfAllPosts } from "./getTagsOfAllPosts";
import { getTagsOfSpecificPost } from "./getTagsOfSpecificPost";
import { getPostsOfSpecificTag } from "./getPostsOfSpecificTag";

async function main() {
  try {
    console.log("main.js clearDatabase()");
    await clearDatabase();

    console.log("main.js createAndSaveUsers()");
    const userEntities = await createAndSaveUsers();
    console.log("main.js createAndSaveUsers() userEntities:", userEntities);

    console.log("main.js createAndSavePosts()");
    const postEntities = await createAndSavePosts(userEntities);
    console.log("main.js createAndSavePosts() postEntities:", postEntities);

    console.log("main.js createAndSaveTags()");
    const tagEntities = await createAndSaveTags();
    console.log("main.js createAndSaveTags() tagEntities:", tagEntities);

    console.log("main.js createAndSavePostTags()");
    const postTagEntities = await createAndSavePostTags(
      postEntities,
      tagEntities
    );
    console.log(
      "main.js createAndSavePostTags() postTagEntities:",
      postTagEntities
    );

    console.log("main.js getTagsOfAllPosts()");
    const allPostTags = await getTagsOfAllPosts();
    console.log("main.js getTagsOfAllPosts() allPostTags:");
    console.dir(allPostTags, { depth: null });

    // 特定のPostからTagを取得する
    console.log("main.js getTagsOfSpecificPost()");
    const specificPostTags = await getTagsOfSpecificPost(postEntities);
    console.log("main.js getTagsOfSpecificPost() specificPostTags:");
    console.dir(specificPostTags, { depth: null });

    // Todo:特定のTagからPostを取得する
    console.log("main.js getTagsOfSpecificPost()");
    const specificTagPosts = await getPostsOfSpecificTag(tagEntities);
    console.log("main.js getPostsOfSpecificTag() specificTagPosts:");
    console.dir(specificTagPosts, { depth: null });
  } catch (error: any) {
    console.error("error.message", error.meta);
  }
}

main()
  .catch((error: any) => {
    console.error("error.message", error.meta);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
