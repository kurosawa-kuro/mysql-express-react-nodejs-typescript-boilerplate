// backend\__test__\admin\readAllUsers.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
  createAdminUser,
} from "../../testUtils";
import { db } from "../../../database/prisma/prismaClient";
import { UserInfo } from "../../../interfaces";
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

  it("allows admin to retrieve all users", async () => {
    const users = [
      await createUserInDB("john@email.com", "123456"),
      await createUserInDB("jane@email.com", "123456"),
    ];

    const response = await agent
      .get(`/api/users/`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(200);

    users.forEach((user) => {
      const userInResponse = response.body.find(
        (resUser: UserInfo) => resUser.id === user.id
      );
      expect(userInResponse).toBeDefined();
      expect(userInResponse.email).toEqual(user.email);
    });
  });

  it("returns empty array when no users exist", async () => {
    await db.user.deleteMany({
      where: {
        isAdmin: false,
      },
    });

    const response = await agent
      .get(`/api/users/`)
      .set("Cookie", `jwt=${adminToken}`);

    expect(response.status).toBe(200);
  });
});
