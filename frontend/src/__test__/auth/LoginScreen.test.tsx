// frontend\src\__test__\auth\LoginScreen.test.tsx
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { App } from "../../App";
import { LoginScreen } from "../../screens/auth/LoginScreen";
import { createServer } from "../testUtils";
import { UserData } from "../../../../backend/__test__/testData";
import { rest } from "msw";

const server = createServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("shows username in header after successful login", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("email"), {
    target: { value: UserData.email },
  });

  fireEvent.change(screen.getByLabelText("password"), {
    target: { value: UserData.password },
  });

  fireEvent.click(screen.getByTestId("login"));

  await waitFor(async () => {
    expect(screen.getByTestId("user-info-name")).toHaveTextContent(
      UserData.name
    );
  });
});

test("login fail", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  server.use(
    rest.post("http://localhost:8080/api/users/login", (_req, res, ctx) => {
      return res(
        ctx.status(401),
        ctx.json({ message: "Invalid email or password" })
      );
    })
  );
  fireEvent.change(screen.getByLabelText("email"), {
    target: { value: "user@email.co" },
  });

  fireEvent.change(screen.getByLabelText("password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByTestId("login"));
  expect(
    await screen.findByText("Invalid email or password")
  ).toBeInTheDocument();
  await waitFor(() => {
    const johnText = screen.queryByText("john");
    expect(johnText).not.toBeInTheDocument();
  });
});
