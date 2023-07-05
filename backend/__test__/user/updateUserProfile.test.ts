// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";

describe("PUT /api/users/profile", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("updates a user profile", async () => {
    await createUserInDB("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeTruthy();

    const response = await agent
      .put("/api/users/profile")
      .set("Cookie", `jwt=${token}`)
      .send({ name: "john updated", email: "johnupdated@email.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toEqual("johnupdated@email.com");
    expect(response.body.name).toEqual("john updated");
  });

  it("rejects unauthenticated access", async () => {
    const response = await agent.put("/api/users/profile");

    expect(response.status).toBe(401);
  });

  it("updates a user profile even if email is missing", async () => {
    await createUserInDB("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeTruthy();

    const response = await agent
      .put("/api/users/profile")
      .set("Cookie", `jwt=${token}`)
      .send({ name: "john updated" });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("john updated");
  });
});
