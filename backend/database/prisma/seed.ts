import { User, Post, Tag, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "./prismaClient";

async function clearDatabase() {
  await db.$executeRaw`SET FOREIGN_KEY_CHECKS=0;`;
  await db.$executeRaw`TRUNCATE TABLE TagsOnPosts;`;
  await db.$executeRaw`TRUNCATE TABLE Post;`;
  await db.$executeRaw`TRUNCATE TABLE Tag;`;
  await db.$executeRaw`TRUNCATE TABLE User;`;
  await db.$executeRaw`SET FOREIGN_KEY_CHECKS=1;`;
}

async function createAndSaveUsers() {
  const users: Prisma.UserCreateInput[] = [
    {
      name: "Admin",
      email: "admin@email.com",
      password: "123456",
      isAdmin: true,
    },
    {
      name: "User1",
      email: "user1@email.com",
      password: "123456",
      isAdmin: false,
    },
    {
      name: "User2",
      email: "user2@email.com",
      password: "123456",
      isAdmin: false,
    },
    // ... add more users as needed
  ];

  const hashedPasswords = await Promise.all(
    users.map((user) => bcrypt.hash(user.password, 10))
  );

  await Promise.all(
    users.map((user, index) => {
      return db.user.create({
        data: {
          name: user.name,
          password: hashedPasswords[index],
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    })
  );

  return await db.user.findMany();
}

async function createAndSavePosts(userEntities: User[]) {
  const user = userEntities.filter((user) => !user.isAdmin);

  const posts: Prisma.PostCreateInput[] = [
    {
      user: { connect: { id: user[0].id } },
      image: "image_url1",
      description: "post_description1",
    },
    {
      user: { connect: { id: user[0].id } },
      image: "image_url2",
      description: "post_description2",
    },
    {
      user: { connect: { id: user[1].id } },
      image: "image_url3",
      description: "post_description3",
    },
    // ... add more posts as needed
  ];

  await Promise.all(
    posts.map((post) => {
      const { user, image, description } = post;
      return db.post.create({
        data: {
          user,
          image,
          description,
        },
      });
    })
  );

  return await db.post.findMany();
}

async function createAndSaveTags() {
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

async function createAndSavePostTags(postEntities: Post[], tagEntities: Tag[]) {
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

async function getTagsOfAllPosts() {
  return await db.tagsOnPosts.findMany({
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
}

async function getTagsOfSpecificPost(postEntities: Post[]) {
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

async function main() {
  console.log("seed.js clearDatabase()");
  await clearDatabase();

  console.log("seed.js createAndSaveUsers()");
  const userEntities = await createAndSaveUsers();
  console.log("seed.js createAndSaveUsers() userEntities:", userEntities);

  console.log("seed.js createAndSavePosts()");
  const postEntities = await createAndSavePosts(userEntities);
  console.log("seed.js createAndSavePosts() postEntities:", postEntities);

  console.log("seed.js createAndSaveTags()");
  const tagEntities = await createAndSaveTags();
  console.log("seed.js createAndSaveTags() tagEntities:", tagEntities);

  console.log("seed.js createAndSavePostTags()");
  const postTagEntities = await createAndSavePostTags(
    postEntities,
    tagEntities
  );
  console.log(
    "seed.js createAndSavePostTags() postTagEntities:",
    postTagEntities
  );

  console.log("seed.js getTagsOfAllPosts()");
  const allPostTags = await getTagsOfAllPosts();
  console.log("seed.js getTagsOfAllPosts() allPostTags:");
  console.dir(allPostTags, { depth: null });

  console.log("seed.js getTagsOfSpecificPost()");
  const specificPostTags = await getTagsOfSpecificPost(postEntities);
  console.log("Processed data:", specificPostTags);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
