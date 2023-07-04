// frontend\src\__test__\auth\RegisterScreen.test.tsx

import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { App } from "../../App";
import { RegisterScreen } from "../../screens/auth/RegisterScreen"; // Ensure this import is correct
import { createServer } from "../testUtils";
import { rest } from "msw";
import { UserData } from "../../../../backend/__test__/testData";

const server = createServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Registration Screen", () => {
  it("should show username in header after successful registration", async () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/register" element={<RegisterScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "User" },
    });

    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "user@email.com" },
    });

    fireEvent.change(screen.getByTestId("input-password"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByTestId("input-confirmPassword"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByTestId("register"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(
      await screen.findByText("Registration successful")
    ).toBeInTheDocument();

    await waitFor(async () => {
      expect(screen.getByTestId("user-info-name")).toHaveTextContent("User");
    });
  });

  it("should show an error message when password confirmation does not match", async () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/register" element={<RegisterScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: UserData.name },
    });

    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: UserData.email },
    });

    fireEvent.change(screen.getByTestId("input-password"), {
      target: { value: UserData.password },
    });

    fireEvent.change(screen.getByTestId("input-confirmPassword"), {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByTestId("register"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("should show an error message when registration fails due to server error", async () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/register" element={<RegisterScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    server.use(
      rest.post(
        "http://localhost:8080/api/users/register",
        (_req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({ message: "Invalid email or password" })
          );
        }
      )
    );

    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "john" },
    });

    fireEvent.change(screen.getByTestId("input-email"), {
      target: { value: "john@email.com" },
    });

    fireEvent.change(screen.getByTestId("input-password"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByTestId("input-confirmPassword"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByTestId("register"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(
      await screen.findByText("Invalid email or password")
    ).toBeInTheDocument();
  });
});
