// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";

describe("PUT /api/users/profile/password", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("updates a user profile password", async () => {
    await createUserInDB("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeTruthy();

    const response = await agent
      .put("/api/users/profile/password")
      .set("Cookie", `jwt=${token}`)
      .send({
        password: "123456",
        confirmPassword: "123456",
        newPassword: "1234567",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("updates a user profile password", async () => {
    await createUserInDB("john@email.com", "123456");
    const token = await loginUserAndGetToken(agent, "john@email.com", "123456");

    expect(token).toBeTruthy();

    const response = await agent
      .put("/api/users/profile/password")
      .set("Cookie", `jwt=${token}`)
      .send({
        password: "123456",
        confirmPassword: "1234567",
        newPassword: "1234567",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Passwords do not match");
  });
});
