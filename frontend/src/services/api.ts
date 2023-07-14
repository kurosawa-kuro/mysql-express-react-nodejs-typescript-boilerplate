// frontend\src\services\api.ts

import axios, { AxiosError, AxiosResponse } from "axios";

import { getApiClient } from "./apiClient";
import {
  ErrorMessage,
  UserInfo,
  UserLoginData,
} from "../../../backend/interfaces";
import { Prisma } from "@prisma/client";

const apiClient = getApiClient();

const handleApiError = (error: AxiosError<ErrorMessage>) => {
  if (error.response) {
    throw new Error(error.response.data.message);
  } else if (error.request) {
    throw new Error("Unable to connect to the server. Please try again.");
  }
};

const performRequest = async (request: Promise<AxiosResponse<any>>) => {
  try {
    const response = await request;
    return response.data;
  } catch (error: unknown) {
    if (error instanceof axios.AxiosError) {
      handleApiError(error);
    }
  }
};

// User related APIs
export const registerUser = (user: Prisma.UserCreateInput): Promise<UserInfo> =>
  performRequest(apiClient.post("/api/auth/register", user));

export const loginUser = (userLoginData: UserLoginData): Promise<UserInfo> =>
  performRequest(apiClient.post("/api/auth/login", userLoginData));

export const readUsers = (): Promise<UserInfo[]> =>
  performRequest(apiClient.get("/api/users"));

export const readUserById = (userId: number): Promise<UserInfo> =>
  performRequest(apiClient.get(`/api/users/${userId}`));

export const readUserPosts = (userId: number) =>
  performRequest(apiClient.get(`/api/users/${userId}/posts`));

export const updateUserProfile = (
  user: Prisma.UserUpdateInput
): Promise<UserInfo> =>
  performRequest(apiClient.put("/api/users/profile", user));

export const updateUser = (user: {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}): Promise<UserInfo> =>
  performRequest(apiClient.put(`/api/users/${user.id}`, user));

export const deleteUser = (id: number) =>
  performRequest(apiClient.delete(`/api/users/${id}`));

export const logoutUser = () =>
  performRequest(apiClient.post("/api/auth/logout"));

export const readTop = (): Promise<string> =>
  performRequest(apiClient.get(`/api/`));

export const uploadImage = async (imageData: FormData) =>
  performRequest(apiClient.post("/api/upload", imageData));

// Post
// createPost
export const createPost = async (postData: any) =>
  performRequest(apiClient.post("/api/posts", postData));

// readPosts
export const readPosts = async () =>
  performRequest(apiClient.get("/api/posts"));

export const readPost = async (id: number) =>
  performRequest(apiClient.get(`/api/posts/${id}`));

export const createFollow = async (id: number) =>
  performRequest(apiClient.post(`/api/users/follow/${id}`));

// deleteFollow
export const deleteFollow = async (id: number) =>
  performRequest(apiClient.delete(`/api/users/follow/${id}`));
