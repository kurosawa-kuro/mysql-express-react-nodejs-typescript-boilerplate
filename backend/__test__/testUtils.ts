// backend\__test__\testUtils.ts

import { SuperAgentTest } from "supertest";
import { db } from "../database/prisma/prismaClient";
import { User } from "@prisma/client";
import { hashPassword } from "../utils";
import { AdminData, UserData } from "./testData";

/**
 * Database Operations
 */
export const clearDatabase = async (): Promise<void> => {
  await db.$executeRaw`SET FOREIGN_KEY_CHECKS=0;`;
  await db.$executeRaw`TRUNCATE TABLE tags_on_posts;`;
  await db.$executeRaw`TRUNCATE TABLE post;`;
  await db.$executeRaw`TRUNCATE TABLE tag;`;
  await db.$executeRaw`TRUNCATE TABLE user;`;
  await db.$executeRaw`SET FOREIGN_KEY_CHECKS=1;`;
};

// export const ensureAdminExists = async (): Promise<User> => {
//   const isAdmin = await db.user.findFirst({ where: { isAdmin: true } });
//   if (isAdmin) {
//     return isAdmin;
//   }
//   return await createUserWithRole("admine@mail.com", "adminpw", true);
// };

/**
 * User Operations
 */
const createUserWithRole = async (
  email: string,
  password: string,
  isAdmin: boolean
): Promise<User> => {
  const hashedPassword = await hashPassword(password);
  try {
    const user = await db.user.create({
      data: {
        name: isAdmin ? AdminData.name : UserData.name,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });

    if (!user) {
      throw new Error(`Failed to create user with email ${email}`);
    }

    return user;
  } catch (error) {
    throw new Error(`An error occurred while creating the user: ${error}`);
  }
};

export const createUserInDB = (email: string, password: string) =>
  createUserWithRole(email, password, false);
export const createAdminUser = () =>
  createUserWithRole(AdminData.email, AdminData.password, true);

/**
 * Other Operations
 */
export const loginUserAndGetToken = async (
  agent: SuperAgentTest,
  email: string,
  password: string
): Promise<string> => {
  const loginResponse = await agent
    .post("/api/users/login")
    .send({ email, password });

  if (loginResponse.status !== 200) {
    throw new Error("Login failed during test setup");
  }

  const match = loginResponse.headers["set-cookie"][0].match(/jwt=([^;]+)/);
  if (!match) {
    throw new Error("Failed to extract token from cookie");
  }

  return match[1];
};
