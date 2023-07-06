// backend\__test__\admin\readUserById.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
  createAdminUser,
} from "../../testUtils";
import { AdminData } from "../../testData";

describe("User management endpoints", () => {
  let agent: SuperAgentTest;
  let adminToken: string;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);

    await createAdminUser();
    adminToken = await loginUserAndGetToken(
      agent,
      AdminData.email,
      AdminData.password
    );
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("allows admin to retrieve a user by ID", async () => {
    const user = await createUserInDB("doe@email.com", "123456");

    const response = await agent
      .get(`/api/users/${user.id}`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toEqual(user.email);
  });

  it("throws an error when user to be retrieved does not exist", async () => {
    const response = await agent
      .get(`/api/users/9999`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(404);
  });
});
