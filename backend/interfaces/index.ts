import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Post, Tag, TagsOnPosts, User } from "@prisma/client";

// --------------------------
// User related interfaces

export interface UserInfo extends Partial<User> {
  confirmPassword?: string;
  token?: string;
}

export interface UserData extends Pick<User, "name" | "email" | "password"> {
  id?: number;
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
