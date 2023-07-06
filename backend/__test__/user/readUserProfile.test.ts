// backend\__test__\user\getProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";

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
    await createUserInDB(UserData.email, UserData.password);
    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    expect(token).toBeTruthy();

    const response = await agent
      .get("/api/users/profile")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toEqual(UserData.email);
  });

  it("rejects unauthenticated access", async () => {
    const response = await agent.get("/api/users/profile");

    expect(response.status).toBe(401);
  });
});
