// backend\__test__\user\updateUserProfile.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";

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
    await createUserInDB(UserData.email, UserData.password);
    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    expect(token).toBeTruthy();

    const response = await agent
      .put("/api/users/profile")
      .set("Cookie", `jwt=${token}`)
      .send({
        name: "updated " + UserData.name,
        email: "updated " + UserData.email,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("updated " + UserData.name);
    expect(response.body.email).toEqual("updated " + UserData.email);
  });

  it("rejects unauthenticated access", async () => {
    const response = await agent.put("/api/users/profile");

    expect(response.status).toBe(401);
  });

  it("updates a user profile even if email is missing", async () => {
    await createUserInDB(UserData.email, UserData.password);
    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    expect(token).toBeTruthy();

    const response = await agent
      .put("/api/users/profile")
      .set("Cookie", `jwt=${token}`)
      .send({ name: "updated " + UserData.name });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("updated " + UserData.name);
  });
});
