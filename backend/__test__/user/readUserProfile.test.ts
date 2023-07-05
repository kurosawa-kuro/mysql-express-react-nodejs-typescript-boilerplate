// backend\__test__\user\getProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";

describe("GET /api/users/profile", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("gets a user profile", async () => {
    await createUserInDB("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeTruthy();

    const response = await agent
      .get("/api/users/profile")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toEqual("john@email.com");
  });

  it("rejects unauthenticated access", async () => {
    const response = await agent.get("/api/users/profile");

    expect(response.status).toBe(401);
  });
});
