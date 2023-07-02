// backend\database\prisma\seed\main.ts

import { db } from "../prismaClient";
import { clearDatabase } from "./clearDatabase";
import { createAndSaveUsers } from "./createAndSaveUsers";
import { createAndSavePosts } from "./createAndSavePosts";
import { createAndSaveTags } from "./createAndSaveTags";
import { createAndSavePostTags } from "./createAndSavePostTags";
import { getTagsOfAllPosts } from "./getTagsOfAllPosts";
import { getTagsOfSpecificPost } from "./getTagsOfSpecificPost";

async function main() {
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

  console.log("main.js getTagsOfSpecificPost()");
  const specificPostTags = await getTagsOfSpecificPost(postEntities);
  console.log("main.js getTagsOfSpecificPost() specificPostTags:");
  console.dir(specificPostTags, { depth: null });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
