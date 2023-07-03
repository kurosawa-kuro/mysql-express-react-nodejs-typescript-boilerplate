// frontend\src\screens\product\HomeScreen.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "../../screens/HomeScreen";

const server = setupServer(
  rest.get("http://localhost:8080/api/", (_req, res, ctx) => {
    return res(ctx.text("API is running...."));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders HomeScreen with product list", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(screen.getByText("API is running....")).toBeInTheDocument()
  );
});
