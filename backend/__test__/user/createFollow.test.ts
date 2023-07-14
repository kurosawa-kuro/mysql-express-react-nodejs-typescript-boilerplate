// backend\__test__\user\createFollow.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";

describe("POST /api/users/follow/:id", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("creates a follow", async () => {
    const followee = await createUserInDB(UserData.email, UserData.password);
    const follower = await createUserInDB("follower@test.com", "password");

    const token = await loginUserAndGetToken(
      agent,
      "follower@test.com",
      "password"
    );

    expect(token).toBeTruthy();

    const response = await agent
      .post(`/api/users/follow/${followee.id}`)
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    expect(response.body.followerId).toEqual(followee.id);
    expect(response.body.followeeId).toEqual(follower.id);
  });

  it("rejects unauthenticated access", async () => {
    const followee = await createUserInDB(UserData.email, UserData.password);

    const response = await agent.post(`/api/users/follow/${followee.id}`);

    expect(response.status).toBe(401);
  });
});
