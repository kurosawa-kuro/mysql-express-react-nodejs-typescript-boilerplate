// backend\__test__\user\deleteFollow.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";

describe("DELETE /api/users/follow/:id", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("deletes a follow", async () => {
    const followee = await createUserInDB(UserData.email, UserData.password);
    const follower = await createUserInDB("follower@test.com", "password");

    let token = await loginUserAndGetToken(
      agent,
      "follower@test.com",
      "password"
    );

    // First, establish a follow relationship
    let response = await agent
      .post(`/api/users/follow/${followee.id}`)
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(201);

    // Now, delete the follow relationship
    response = await agent
      .delete(`/api/users/follow/${followee.id}`)
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Follow deleted" });
  });

  it("rejects unauthenticated access", async () => {
    const followee = await createUserInDB(UserData.email, UserData.password);

    const response = await agent.delete(`/api/users/follow/${followee.id}`);

    expect(response.status).toBe(401);
  });
});
