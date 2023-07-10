// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";
import { db } from "../../database/prisma/prismaClient";

describe("Get /api/post", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should retrieve a specific post when requested with a valid user and post id", async () => {
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
      .get("/api/posts/1")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("description");
    // expect(response.body.description).toEqual("post_description1");
  });
});
