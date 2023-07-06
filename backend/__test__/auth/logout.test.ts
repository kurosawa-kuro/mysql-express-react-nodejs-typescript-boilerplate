// backend\__test__\auth\logout.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
} from "../testUtils";
import { UserData } from "../testData";

describe("POST /api/users/logout", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("logs out a user", async () => {
    await createUserInDB(UserData.email, UserData.password);
    const token = await loginUserAndGetToken(
      agent,
      UserData.email,
      UserData.password
    );

    expect(token).toBeTruthy();

    const logoutResponse = await agent.post("/api/users/logout");

    expect(logoutResponse.status).toBe(200);

    expect(logoutResponse.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^jwt=;/)])
    );
  });
});
