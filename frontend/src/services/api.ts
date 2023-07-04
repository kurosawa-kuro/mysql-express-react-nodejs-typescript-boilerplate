// frontend\src\services\api.ts

import axios, { AxiosError, AxiosResponse } from "axios";

import { getApiClient } from "./apiClient";
import {
  UserInfo,
  ErrorMessage,
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
export const registerUser = (user: Prisma.UserCreateInput) =>
  performRequest(apiClient.post("/api/users/register", user));

export const loginUser = (userLoginData: UserLoginData) =>
  performRequest(apiClient.post("/api/users/login", userLoginData));

export const readUserProfile = () =>
  performRequest(apiClient.get("/api/users/profile"));

export const readAllUsers = () => performRequest(apiClient.get("/api/users"));

export const readUserById = (userId: number) =>
  performRequest(apiClient.get(`/api/users/${userId}`));

export const updateUserProfile = (user: Prisma.UserUpdateInput) =>
  performRequest(apiClient.put("/api/users/profile", user));

export const updateUser = (user: UserInfo) =>
  performRequest(apiClient.put(`/api/users/${user.id}`, user));

export const deleteUser = (id: number) =>
  performRequest(apiClient.delete(`/api/users/${id}`));

export const logoutUser = () =>
  performRequest(apiClient.post("/api/users/logout"));

export const readTopStatusApi = (): Promise<string> =>
  performRequest(apiClient.get(`/api/`));
