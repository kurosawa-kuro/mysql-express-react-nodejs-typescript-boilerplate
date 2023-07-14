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

  it("reads a user's posts", async () => {
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

  it("rejects unauthenticated access", async () => {
    const user = await createUserInDB(UserData.email, UserData.password);
    const response = await agent.get(`/api/users/${user.id}/posts`);

    expect(response.status).toBe(401);
  });
});
