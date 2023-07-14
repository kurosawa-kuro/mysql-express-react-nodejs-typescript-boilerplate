// frontend\src\services\__tests__\api.test.ts
import { rest } from "msw";
import { setupServer } from "msw/node";
import { loginUser, registerUser } from "../../services/api";

interface ReqBody {
  email?: string;
  password?: string;
  name?: string;
}

const API_BASE_URL = "http://localhost:8080/api";

const user = {
  name: "User",
  email: "user@email.com",
  password: "123456",
  isAdmin: false,
};

const server = setupServer(
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    const requestBody = req.body as ReqBody;
    if (
      requestBody.email === user.email &&
      requestBody.password === user.password
    ) {
      return res(ctx.json(user));
    } else {
      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid email or password" })
      );
    }
  }),
  rest.post(`${API_BASE_URL}/auth/register`, (req, res, ctx) => {
    const requestBody = req.body as ReqBody;
    if (
      requestBody.email === user.email &&
      requestBody.password === user.password &&
      requestBody.name === user.name
    ) {
      return res(ctx.json(user));
    } else {
      return res(ctx.status(400), ctx.json({ message: "Registration failed" }));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loginUser logs in a user", async () => {
  const data = await loginUser({
    email: user.email,
    password: user.password,
  });

  expect(data).toEqual(user);
});

test("registerUser registers a user", async () => {
  const data = await registerUser({
    name: user.name,
    email: user.email,
    password: user.password,
  });

  expect(data).toEqual(user);
});
