// backend/__test__/user/readUserPosts.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";
import { createPost } from "../../controllers/postController";
import { createPostInDB } from "../../models/postModel";
import { db } from "../../database/prisma/prismaClient";

describe("GET /api/users/:id/posts", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should return the posts of a specified user when a valid user id is provided", async () => {
    const user = await createUserInDB(UserData.email, UserData.password);

    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    await createPostInDB(Number(user.id), "Test Post");

    const response = await agent
      .get(`/api/users/${user.id}/posts`)
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.posts[0].description).toEqual("Test Post");
  });

  it("should return a 401 status code when the request is made by an unauthenticated user", async () => {
    const user = await createUserInDB(UserData.email, UserData.password);
    const response = await agent.get(`/api/users/${user.id}/posts`);

    expect(response.status).toBe(401);
  });

  it("should indicate if the currently authenticated user is following the user specified by the id", async () => {
    const user = await createUserInDB(UserData.email, UserData.password);
    const follower = await createUserInDB("follower@test.com", "password");

    await db.follow.create({
      data: {
        followerId: user.id,
        followeeId: follower.id,
      },
    });

    const token = await loginUserAndGetToken(
      agent,
      "follower@test.com",
      "password"
    );

    await createPostInDB(Number(user.id), "Test Post");

    const response = await agent
      .get(`/api/users/${user.id}/posts`)
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);

    expect(response.body.user.isFollowed).toBe(true);

    expect(response.body.user.followerCount).toBe(1);
    expect(response.body.user.followeeCount).toBe(0);

    expect(response.body.posts[0].description).toEqual("Test Post");
  });
});
