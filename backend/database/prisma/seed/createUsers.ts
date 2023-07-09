// backend\database\prisma\seed\createUsers.ts

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "../prismaClient";
import { AdminData, User2Data, UserData } from "../../../__test__/testData";

export async function createUsers() {
  const users: Prisma.UserCreateInput[] = [
    {
      name: AdminData.name,
      email: AdminData.email,
      password: AdminData.password,
      isAdmin: AdminData.isAdmin,
    },
    {
      name: UserData.name,
      email: UserData.email,
      password: UserData.password,
      isAdmin: UserData.isAdmin,
    },
    {
      name: User2Data.name,
      email: User2Data.email,
      password: User2Data.password,
      isAdmin: User2Data.isAdmin,
    },
  ];

  const hashedPasswords = await Promise.all(
    users.map((user) => bcrypt.hash(user.password, 10))
  );

  await Promise.all(
    users.map((user, index) => {
      return db.user.create({
        data: {
          name: user.name,
          password: hashedPasswords[index],
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    })
  );

  return await db.user.findMany();
}
