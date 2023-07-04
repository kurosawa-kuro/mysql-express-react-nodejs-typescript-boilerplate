// frontend\src\__test__\auth\RegisterScreen.test.tsx

import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { App } from "../../App";
import { RegisterScreen } from "../../screens/auth/RegisterScreen"; // Ensure this import is correct
import { createServer } from "../testUtils";

const server = createServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("shows username in header after successful registration", async () => {
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

  await waitFor(async () => {
    expect(screen.getByTestId("user-info-name")).toHaveTextContent("User");
  });
});

test("shows error message when registration fails", async () => {
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
    target: { value: "john" },
  });

  fireEvent.change(screen.getByTestId("input-email"), {
    target: { value: "john@email.com" },
  });

  fireEvent.change(screen.getByTestId("input-password"), {
    target: { value: "123456" },
  });

  fireEvent.change(screen.getByTestId("input-confirmPassword"), {
    target: { value: "12345" },
  });

  fireEvent.click(screen.getByTestId("register"));

  await waitFor(() => {
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  await waitFor(() => {
    const johnText = screen.queryByText("john");
    expect(johnText).not.toBeInTheDocument();
  });
});
