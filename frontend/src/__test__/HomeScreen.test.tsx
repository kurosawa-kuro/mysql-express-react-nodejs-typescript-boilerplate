// frontend\src\screens\product\HomeScreen.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "../screens/HomeScreen";
import { simulateLogin } from "./testUtils";
import { App } from "../App";

const server = setupServer(
  rest.get("http://localhost:8080/api/", (_req, res, ctx) => {
    return res(ctx.text("API is running...."));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("HomeScreen", () => {
  it("renders the HomeScreen and displays the API status when API request is successful", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<HomeScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await simulateLogin();
    await waitFor(() =>
      expect(screen.getByText("API is running....")).toBeInTheDocument()
    );
  });

  it("displays an error message when the API request fails", async () => {
    server.use(
      rest.get("http://localhost:8080/api/", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }));
      })
    );

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<HomeScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await simulateLogin();
    await waitFor(() =>
      expect(screen.getByText("Server error")).toBeInTheDocument()
    );
  });
});
