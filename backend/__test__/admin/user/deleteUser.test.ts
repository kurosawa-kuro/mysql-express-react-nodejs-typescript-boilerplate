// backend\__test__\user\userManagement.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
  createAdminUser,
} from "../../testUtils";
import { User } from "@prisma/client";
import { AdminData } from "../../testData";

describe("User management endpoints", () => {
  let agent: SuperAgentTest;
  let adminToken: string;
  let admin: User;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);

    admin = await createAdminUser();
    adminToken = await loginUserAndGetToken(
      agent,
      AdminData.email,
      AdminData.password
    );
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("allows admin to delete a user", async () => {
    const user = await createUserInDB("doe@email.com", "123456");

    const response = await agent
      .delete(`/api/users/${user.id}`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User removed" });
  });

  it("prevents deleting an admin user", async () => {
    const response = await agent
      .delete(`/api/users/${admin.id}`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(400);
  });

  it("throws an error when user to be deleted does not exist", async () => {
    const response = await agent
      .delete(`/api/users/9999`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(404);
  });
});
