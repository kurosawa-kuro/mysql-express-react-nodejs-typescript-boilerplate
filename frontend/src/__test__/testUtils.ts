// frontend\src\screens\admin\product\testUtils.ts

import { screen, renderHook, prettyDOM, act } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { useAuthStore } from "../state/store";
import { UserInfo } from "../../../backend/interfaces";
import { UserData, AdminData } from "../../../backend/__test__/testData";

export const printDOM = (length: number = 50000) =>
  console.log(prettyDOM(document.body, length));

export const API_BASE_URL = "http://localhost:8080/api";

function authenticate(email: string, password: string, user: typeof UserData) {
  return email === user.email && password === user.password;
}

export function createServer() {
  return setupServer(
    rest.post(`${API_BASE_URL}/users/register`, async (_req, res, ctx) => {
      return res(ctx.json({ id: 1, ...UserData }));
    }),
    rest.post(`${API_BASE_URL}/users/login`, async (req, res, ctx) => {
      const requestBody = JSON.parse(await req.text()) as any;
      if (authenticate(requestBody.email, requestBody.password, AdminData)) {
        return res(ctx.json({ id: 1, ...AdminData }));
      }

      if (authenticate(requestBody.email, requestBody.password, UserData)) {
        return res(ctx.json({ id: 1, ...UserData }));
      }

      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid email or password" })
      );
    })
  );
}

export async function simulateLogin(isAdmin: boolean = false) {
  let userInfo: UserInfo = isAdmin
    ? { ...AdminData, id: 1, token: "aaaaaaaa" }
    : { ...UserData, id: 1, token: "aaaaaaaa" };

  const { result } = renderHook(() => useAuthStore());

  act(() => {
    result.current.setUserInfo(userInfo);
  });

  if (userInfo.name) {
    await screen.findByText(userInfo.name, {
      selector: '[data-testid="user-info-name"]',
    });
  }
}
