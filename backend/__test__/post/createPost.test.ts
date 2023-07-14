// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";
import { createPostInDB } from "../../models/postModel";

describe("POST /api/posts", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should create a new post when provided with valid user and post details", async () => {
    await createUserInDB(UserData.email, UserData.password);
    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    expect(token).toBeTruthy();

    const response = await agent
      .post("/api/posts")
      .set("Cookie", `jwt=${token}`)
      .send({
        description: "description description description",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toEqual(
      "description description description"
    );
  });

  it("should throw an error when trying to create a post with non-existing user", async () => {
    const nonExistingUserId = 9999;
    const description = "description for non-existing user's post";

    await expect(
      createPostInDB(nonExistingUserId, description)
    ).rejects.toThrow("User does not exist");
  });
});
