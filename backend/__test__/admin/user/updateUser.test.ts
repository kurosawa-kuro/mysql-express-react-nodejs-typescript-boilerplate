// backend\__test__\user\updateUser.test.ts

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

  it("allows admin to update a user", async () => {
    const user = await createUserInDB("doe@email.com", "123456");

    const response = await agent
      .put(`/api/users/${user.id}`)
      .send({ name: "Updated User", email: "updated@email.com", isAdmin: true })
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("Updated User");
    expect(response.body.email).toEqual("updated@email.com");
    expect(response.body.isAdmin).toBe(true);
  });

  it("throws an error when user to be updated does not exist", async () => {
    const response = await agent
      .put(`/api/users/9999`)
      .send({ name: "Updated User", email: "updated@email.com", isAdmin: true })
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(404);
  });
});
