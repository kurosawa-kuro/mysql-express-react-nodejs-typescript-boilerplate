// frontend\src\__test__\screen\user\UserScreen.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { UserScreen } from "../../../screens/user/UserScreen";
import { UserData } from "../../../../../backend/__test__/testData";
import { App } from "../../../App";

const server = setupServer(
  rest.get("http://localhost:8080/api/users/:id", (_req, res, ctx) => {
    return res(ctx.json(UserData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UserScreen", () => {
  it("renders the UserScreen and shows user details", async () => {
    render(
      <MemoryRouter initialEntries={["/users/1"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/users/:id" element={<UserScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/User/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(`Name : ${UserData.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Email : ${UserData.email}`)).toBeInTheDocument();
    });
  });

  it("Shows error message when API call fails", async () => {
    server.use(
      rest.get("http://localhost:8080/api/users/:id", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server Error" }));
      })
    );

    render(
      <MemoryRouter initialEntries={["/users/1"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/users/:id" element={<UserScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/User/i)).toBeInTheDocument();

    await waitFor(() => {
      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent("Server Error");
    });
  });
});
