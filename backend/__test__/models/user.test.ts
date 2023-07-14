// backend\__test__\database\user.test.ts

import { User } from "@prisma/client";
import { db } from "../../database/prisma/prismaClient";
import { clearDatabase } from "../testUtils";
import { hashPassword } from "../../utils";
import {
  readUsersFromDB,
  readUserByIdInDB,
  updateUserByIdInDB,
  deleteUserByIdInDB,
} from "../../models/userModel";
import { AdminData, UserData } from "../testData";

describe("Database user operations", () => {
  beforeEach(async () => {
    await clearDatabase();
    await db.user.create({
      data: {
        name: UserData.name,
        email: UserData.email,
        password: await hashPassword(UserData.password),
        isAdmin: false,
      },
    });

    await db.user.create({
      data: {
        name: AdminData.name,
        email: AdminData.email,
        password: await hashPassword(AdminData.password),
        isAdmin: true,
      },
    });
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should connect to the database", async () => {
    await expect(db.$connect()).resolves.toBe(undefined);
  });

  it("should read all users from the database", async () => {
    const users = await readUsersFromDB();

    expect(users.length).toBe(2);
    expect(users[0]).toHaveProperty("name", UserData.name);
    expect(users[1]).toHaveProperty("name", AdminData.name);
  });

  it("should read a user by ID from the database", async () => {
    const user: User = await db.user.create({
      data: {
        name: "jane",
        email: "jane@email.com",
        password: await hashPassword("123456"),
        isAdmin: false,
      },
    });

    const retrievedUser = await readUserByIdInDB(user.id, user.id);

    expect(retrievedUser).toEqual({
      ...user,
      followedBy: expect.any(Array),
      _count: expect.any(Object),
      followeeCount: expect.any(Number),
      followerCount: expect.any(Number),
      isFollowed: expect.any(Boolean),
    });
  });

  it("should update a user by ID in the database", async () => {
    const user: User = await db.user.create({
      data: {
        name: "jack",
        email: "jack@email.com",
        password: await hashPassword("123456"),
        isAdmin: false,
      },
    });

    const updatedUser = await updateUserByIdInDB(user.id, {
      name: "updatedJack",
    });

    expect(updatedUser.name).toBe("updatedJack");
  });

  it("should delete a user by ID from the database", async () => {
    const user: User = await db.user.create({
      data: {
        name: "jill",
        email: "jill@email.com",
        password: await hashPassword("123456"),
        isAdmin: false,
      },
    });

    await deleteUserByIdInDB(user.id);

    const retrievedUser = await db.user.findUnique({ where: { id: user.id } });
    expect(retrievedUser).toBeNull();
  });

  it("should correctly identify if a user is following another user", async () => {
    const userA: User = await db.user.create({
      data: {
        name: "User A",
        email: "usera@email.com",
        password: await hashPassword("123456"),
        isAdmin: false,
      },
    });

    const userB: User = await db.user.create({
      data: {
        name: "User B",
        email: "userb@email.com",
        password: await hashPassword("123456"),
        isAdmin: false,
      },
    });

    // userA follows userB
    await db.follow.create({
      data: {
        followerId: userB.id,
        followeeId: userA.id,
      },
    });

    // Check if userA is following userB
    const retrievedUserB = await readUserByIdInDB(userB.id, userA.id);

    expect(retrievedUserB?.isFollowed).toBe(true);

    // Check if userB is following userA
    const retrievedUserA = await readUserByIdInDB(userA.id, userB.id);

    expect(retrievedUserA?.isFollowed).toBe(false);
  });
});
