// backend\controllers\userController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Imports
import { generateToken, hashPassword } from "../utils";
import {
  createUserInDB,
  readAllUsersFromDB,
  readUserByEmailInDB,
  readUserByIdInDB,
  updateUserByIdInDB,
  deleteUserByIdInDB,
  comparePassword,
} from "../models/userModel";
import { UserRequest, UserInfo } from "../interfaces";
import { Prisma } from "@prisma/client";

const _sanitizeUser = (user: any): UserInfo => {
  const { password, ...UserBase } = user;
  return UserBase;
};

const _sanitizeAvatarPath = (path: string) => {
  return path ? path.replace(/\\/g, "/").replace("/frontend/public", "") : "";
};

// CREATE
export const registerUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { name, email, password } = req.body;

    if (!password || !name || !email) {
      res.status(400);
      throw new Error("Invalid user data");
    }

    const userExists = await readUserByEmailInDB(email);

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);
    const user: Prisma.UserCreateInput = {
      name,
      email,
      password: hashedPassword,
    };
    const createdUser = await createUserInDB(user);

    if (createdUser) {
      generateToken(res, createdUser.id);
      res.status(201).json(_sanitizeUser(createdUser));
    }
  }
);

// READ
export const loginUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { email, password } = req.body;
    const user = await readUserByEmailInDB(email);

    if (user && (await comparePassword(password, user.password))) {
      generateToken(res, user.id);
      res.json(_sanitizeUser(user));
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
);

export const readUserProfile = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (req.user && req.user.id) {
      const id = req.user.id;
      const user = await readUserByIdInDB(id);

      if (user) {
        res.json(_sanitizeUser(user));
      }
    }
  }
);

export const readAllUsers = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const users = await readAllUsersFromDB();
    res.json(users.map((user) => _sanitizeUser(user)));
  }
);

export const readUserByIdAdminOnly = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await readUserByIdInDB(id);

    if (user) {
      res.json(_sanitizeUser(user));
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

// UPDATE
export const updateUserProfile = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (req.user && req.user.id) {
      const id = req.user.id;
      const user = await readUserByIdInDB(id);

      if (user) {
        let avatarPath = _sanitizeAvatarPath(req.body.avatarPath);
        const updatedUser = await updateUserByIdInDB(id, {
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          avatarPath: avatarPath || user.avatarPath,
        });
        res.json(_sanitizeUser(updatedUser));
      }
    }
  }
);

export const updateUserProfilePassword = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (req.body.password !== req.body.confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    if (req.user && req.user.id) {
      const id = req.user.id;
      const user = await readUserByIdInDB(id);

      if (user) {
        const updatedUser = await updateUserByIdInDB(id, {
          password: await hashPassword(req.body.newPassword),
        });
        res.json(_sanitizeUser(updatedUser));
      }
    }
  }
);

export const updateUserByAdminOnly = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await readUserByIdInDB(id);

    if (user) {
      const updatedUser = await updateUserByIdInDB(id, {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        isAdmin: Boolean(req.body.isAdmin),
      });

      res.json(_sanitizeUser(updatedUser));
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

// DELETE
export const logoutUser = (req: UserRequest, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const deleteUserAdminOnly = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await readUserByIdInDB(id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Can not delete admin user");
      }

      await deleteUserByIdInDB(id);
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);
