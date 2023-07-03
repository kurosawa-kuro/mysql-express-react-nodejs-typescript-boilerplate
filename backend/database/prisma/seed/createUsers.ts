// backend\database\prisma\seed\createUsers.ts

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "../prismaClient";

export async function createUsers() {
  const users: Prisma.UserCreateInput[] = [
    {
      name: "Admin",
      email: "admin@email.com",
      password: "123456",
      isAdmin: true,
    },
    {
      name: "User1",
      email: "user1@email.com",
      password: "123456",
      isAdmin: false,
    },
    {
      name: "User2",
      email: "user2@email.com",
      password: "123456",
      isAdmin: false,
    },
    // ... add more users as needed
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
