// frontend\src\__test__\screen\user\UserListScreen.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { UserData } from "../../../../../backend/__test__/testData";
import { UserEditScreen } from "../../../screens/admin/user/UserEditScreen";

const server = setupServer(
  rest.get("http://localhost:8080/api/users/2", (_req, res, ctx) => {
    return res(
      ctx.json({
        id: 2,
        name: UserData.name,
        email: UserData.email,
        isAdmin: UserData.isAdmin,
      })
    );
  }),
  rest.put("http://localhost:8080/api/users/2", (_req, res, ctx) => {
    return res(
      ctx.json({
        id: 2,
        name: UserData.name,
        email: UserData.email,
        isAdmin: true,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderScreen = () => {
  render(
    <MemoryRouter initialEntries={["/admin/users/2/edit"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/admin/users/:id/edit" element={<UserEditScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("UserEditScreen Component", () => {
  describe("Rendering", () => {
    it("should render user details correctly", async () => {
      renderScreen();

      await simulateLogin(true);

      await waitFor(() => {
        expect(screen.getByText("AdminTypeScriptShop")).toBeInTheDocument();
      });

      await screen.findByRole("heading", { name: /Edit User/i });

      await waitFor(() => {
        expect(screen.getByDisplayValue(UserData.name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(UserData.email)).toBeInTheDocument();
      });
    });

    it("should toggle isAdmin checkbox when clicked", async () => {
      renderScreen();

      await simulateLogin(true);

      const checkbox = screen.getByRole("checkbox", { name: /is admin/i });
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("should send update request when Update button clicked", async () => {
      renderScreen();

      await simulateLogin(true);

      const button = screen.getByRole("button", { name: /Update/i });
      fireEvent.click(button);
    });

    it("should update input values when they are changed", async () => {
      renderScreen();

      await simulateLogin(true);

      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "Name" },
      });

      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "email" },
      });
    });

    it("should display error message when failed to fetch user", async () => {
      server.use(
        rest.get("http://localhost:8080/api/users/2", (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: "Server Error" }));
        })
      );

      renderScreen();

      await simulateLogin(true);

      await waitFor(() => {
        const alert = screen.getByRole("alert");
        expect(alert).toHaveTextContent("Server Error");
      });
    });

    it("should display error message when failed to update user", async () => {
      server.use(
        rest.put("http://localhost:8080/api/users/2", (_req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: "Server Error" }));
        })
      );

      renderScreen();

      await simulateLogin(true);

      const button = screen.getByRole("button", { name: /Update/i });
      fireEvent.click(button);

      await waitFor(() => {
        const alert = screen.getByRole("alert");
        expect(alert).toHaveTextContent("Server Error");
      });
    });
  });
});
