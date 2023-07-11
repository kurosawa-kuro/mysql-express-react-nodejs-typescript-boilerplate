// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { User2Data, UserData } from "../testData";
import { db } from "../../database/prisma/prismaClient";

describe("Get /api/posts", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should create a new post when provided with valid user and post details", async () => {
    await createUserInDB("UserData.email", UserData.password);
    const users = await db.user.findMany();

    const user1 = users[0];
    const postsData = [
      {
        imagePath: "image_url1",
        description: "post_description1",
        user: { connect: { id: user1.id } },
      },
      {
        imagePath: "image_url2",
        description: "post_description2",
        user: { connect: { id: user1.id } },
      },
      {
        imagePath: "image_url3",
        description: "post_description3",
        user: { connect: { id: user1.id } },
      },
    ];

    await Promise.all(
      postsData.map((postData) =>
        db.post.create({
          data: postData,
        })
      )
    );

    await createUserInDB(UserData.email, UserData.password);
    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    expect(token).toBeTruthy();

    const response = await agent
      .get("/api/posts")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    // response.bodyが配列であることを確認
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("userId");
    expect(response.body[0]).toHaveProperty("description");
    // expect(response.body[0].description).toEqual("post_description1");
  });
});
