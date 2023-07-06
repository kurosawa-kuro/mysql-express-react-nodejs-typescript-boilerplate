// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";

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
    await createUserInDB(UserData.email, UserData.password);
    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    expect(token).toBeTruthy();

    const response = await agent
      .put("/api/users/profile/password")
      .set("Cookie", `jwt=${token}`)
      .send({
        password: UserData.password,
        confirmPassword: UserData.password,
        newPassword: "1234567",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("updates a user profile password", async () => {
    await createUserInDB(UserData.email, UserData.password);
    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    expect(token).toBeTruthy();

    const response = await agent
      .put("/api/users/profile/password")
      .set("Cookie", `jwt=${token}`)
      .send({
        password: UserData.password,
        confirmPassword: "1234567",
        newPassword: "1234567",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Passwords do not match");
  });
});
