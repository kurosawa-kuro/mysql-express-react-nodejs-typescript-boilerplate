// frontend\src\__test__\screen\user\UserListScreen.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { User2Data, UserData } from "../../../../../backend/__test__/testData";
import { UserListScreen } from "../../../screens/user/UserListScreen";

const server = setupServer(
  rest.get("http://localhost:8080/api/users", (_req, res, ctx) => {
    return res(ctx.json([UserData, User2Data]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderScreen = () => {
  render(
    <MemoryRouter initialEntries={["/users"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/users" element={<UserListScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("UserListScreen", () => {
  it("renders the UserListScreen", async () => {
    renderScreen();

    await simulateLogin(true);
    await screen.findByRole("heading", { name: /User list/i });

    await waitFor(() => {
      expect(screen.getByText("AdminTypeScriptShop")).toBeInTheDocument();
      expect(screen.getByText(UserData.email)).toBeInTheDocument();
      expect(screen.getByText(User2Data.email)).toBeInTheDocument();

      const editButtons = screen.queryAllByText("Edit");
      expect(
        editButtons.some((button) => button.textContent === "Edit")
      ).toBeTruthy();

      const deleteButtons = screen.queryAllByText("Delete");
      expect(
        deleteButtons.some((button) => button.textContent === "Delete")
      ).toBeTruthy();
    });
  });

  it("Shows error message when API call fails", async () => {
    server.use(
      rest.get("http://localhost:8080/api/users", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server Error" }));
      })
    );

    renderScreen();
    await simulateLogin();
    await screen.findByRole("heading", { name: /User list/i });

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Server Error");
    });
  });
});
