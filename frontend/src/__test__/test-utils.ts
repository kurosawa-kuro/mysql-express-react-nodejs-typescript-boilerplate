// frontend\src\screens\admin\product\testUtils.ts

import {
  fireEvent,
  screen,
  Matcher,
  renderHook,
  prettyDOM,
  act,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { useAuthStore } from "../state/store";
import { UserInfo } from "../../../backend/interfaces";

export const printDOM = (length: number = 50000) =>
  console.log(prettyDOM(document.body, length));

export const API_BASE_URL = "http://localhost:8080/api";
export const TEST_USER = {
  name: "john",
  email: "john@email.com",
  password: "123456",
  isAdmin: false,
};
export const TEST_ADMIN_USER = {
  name: "admin",
  email: "admin@email.com",
  password: "123456",
  isAdmin: true,
};

function authenticate(email: string, password: string, user: typeof TEST_USER) {
  return email === user.email && password === user.password;
}

export function createServer() {
  return setupServer(
    rest.post(`${API_BASE_URL}/users/register`, async (_req, res, ctx) => {
      return res(ctx.json({ id: 1, ...TEST_USER }));
    }),
    rest.post(`${API_BASE_URL}/users/login`, async (req, res, ctx) => {
      const requestBody = JSON.parse(await req.text()) as any;
      if (
        authenticate(requestBody.email, requestBody.password, TEST_ADMIN_USER)
      ) {
        return res(ctx.json({ id: 1, ...TEST_ADMIN_USER }));
      }

      if (authenticate(requestBody.email, requestBody.password, TEST_USER)) {
        return res(ctx.json({ id: 1, ...TEST_USER }));
      }

      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid email or password" })
      );
    })
  );
}

export const inputField = (label: Matcher, value: any) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

export async function simulateLogin(isAdmin: boolean = false) {
  let userInfo: UserInfo = isAdmin
    ? { ...TEST_ADMIN_USER, id: 1, token: "aaaaaaaa" }
    : { ...TEST_USER, id: 1, token: "aaaaaaaa" };

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
