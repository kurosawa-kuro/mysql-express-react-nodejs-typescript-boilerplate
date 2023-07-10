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
import { readUsersFollowedBySpecificUser } from "./readUsersFollowedBySpecificUser";
import { readUsersFollowingSpecificUser } from "./readUsersFollowingSpecificUser";
import { createUsersAndFollows } from "./createUsersAndFollows";
import { readFollowStatusOfAllUsersForSpecificUser } from "./readFollowStatusOfAllUsersForSpecificUser";

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

    console.log("main.js createUsersAndFollows()");
    const followsEntities = await createUsersAndFollows();
    console.log(
      "main.js createUsersAndFollows() followsEntities:",
      followsEntities
    );

    console.log("main.js readAllPostTags()");
    const allPostTags = await readAllPostTags();
    console.log("main.js readAllPostTags() allPostTags:");
    console.dir(allPostTags, { depth: null });

    console.log("main.js readSpecificPostTags()");
    const specificPostTags = await readSpecificPostTags(postEntities);
    console.log("main.js readSpecificPostTags() specificPostTags:");
    console.dir(specificPostTags, { depth: null });

    console.log("main.js readSpecificTagPosts()");
    const specificTagPosts = await readSpecificTagPosts(tagEntities);
    console.log("main.js readSpecificTagPosts() specificTagPosts:");
    console.dir(specificTagPosts, { depth: null });

    console.log("main.js readUsersFollowedBySpecificUser()");
    const specificFollows = await readUsersFollowedBySpecificUser();
    console.log(
      "main.js readUsersFollowedBySpecificUser() specificFollows:",
      specificFollows
    );

    console.log("main.js readUsersFollowingSpecificUser()");
    const specificFollowers = await readUsersFollowingSpecificUser();
    console.log(
      "main.js readUsersFollowingSpecificUser() specificFollowers:",
      specificFollowers
    );

    console.log("main.js readFollowStatusOfAllUsersForSpecificUser()");
    const followStatus = await readFollowStatusOfAllUsersForSpecificUser();
    console.log(
      "main.js readFollowStatusOfAllUsersForSpecificUser() followStatus:",
      followStatus
    );
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
