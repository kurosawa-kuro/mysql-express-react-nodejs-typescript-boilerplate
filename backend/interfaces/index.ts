import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Post, Prisma, Tag, User } from "@prisma/client";

// --------------------------
// User related interfaces
export interface UserWithoutPassWord extends Omit<User, "password"> {}

export type UserLoginData = Omit<Prisma.UserCreateInput, "name">;
export type UserRegisterData = Prisma.UserCreateInput & {
  confirmPassword?: string;
};

export interface UserInfo extends Partial<UserWithoutPassWord> {
  confirmPassword?: string;
  token?: string;
  posts?: {
    id: number;
    description: string;
    imagePath: string | null;
    user: {
      id: number;
      name: string;
      avatarPath: string | null;
    };
  }[];
  isFollowed?: boolean;
  followeeCount?: number;
  followerCount?: number;
}

export interface UserAuth {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  logout: () => void;
}

// --------------------------
// JWT and Request related interfaces

export interface UserDecodedJwtPayload extends JwtPayload {
  userId: string;
}

export interface UserRequest extends Request {
  user?: UserInfo;
}

// --------------------------
// TagsOnPosts related interfaces
export interface PostWithUserAndTags extends Omit<Post, "userId"> {
  user: {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  tags: Tag[];
}

export interface TagWithUserAndPosts extends Tag {
  posts: Omit<Post, "userId">[];
}

// --------------------------
// Other interfaces

export interface ErrorMessage {
  message: string;
}
