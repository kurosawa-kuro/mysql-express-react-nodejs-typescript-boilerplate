// frontend\src\__test__\screen\user\UserListScreen.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { User2Data, UserData } from "../../../../../backend/__test__/testData";
import { UserListScreen } from "../../../screens/user/UserListScreen";

const server = setupServer(
  rest.get("http://localhost:8080/api/users", (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 2,
          name: UserData.name,
          email: UserData.email,
          isAdmin: UserData.isAdmin,
        },
        {
          id: 3,
          name: User2Data.name,
          email: User2Data.email,
          isAdmin: User2Data.isAdmin,
        },
      ])
    );
  }),
  rest.delete("http://localhost:8080/api/users/:id", (_req, res, ctx) => {
    return res(ctx.status(200));
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

const setup = async () => {
  renderScreen();
  await simulateLogin(true);
};

describe("UserListScreen Component", () => {
  describe("Rendering", () => {
    it("should correctly render the UserListScreen", async () => {
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
  });

  describe("API Interaction", () => {
    describe("GET /users API", () => {
      it("should show an error message when the API call fails", async () => {
        server.use(
          rest.get("http://localhost:8080/api/users", (_req, res, ctx) => {
            return res(ctx.status(500), ctx.json({ message: "Server Error" }));
          })
        );

        await setup();

        await screen.findByRole("heading", { name: /User list/i });

        await waitFor(() => {
          const alert = screen.getByRole("alert");
          expect(alert).toHaveTextContent("Server Error");
        });
      });
    });

    describe("DELETE /users/:id API", () => {
      it("should handle the delete button click correctly when the API call is successful", async () => {
        window.confirm = jest.fn(() => true);
        await setup();

        await screen.findByRole("heading", { name: /User list/i });

        await waitFor(() => {
          expect(screen.getByText(UserData.email)).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalled();
          expect(
            screen.getByText("User deleted successfully")
          ).toBeInTheDocument();
          expect(screen.queryByText(UserData.email)).not.toBeInTheDocument();
        });
      });

      it("should handle the delete button click correctly when the API call fails", async () => {
        server.use(
          rest.delete(
            "http://localhost:8080/api/users/:id",
            (_req, res, ctx) => {
              return res(
                ctx.status(500),
                ctx.json({ message: "Server Error" })
              );
            }
          )
        );
        window.confirm = jest.fn(() => true);
        renderScreen();

        await simulateLogin(true);
        await screen.findByRole("heading", { name: /User list/i });

        await waitFor(() => {
          expect(screen.getByText(UserData.email)).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
          const alert = screen.getByRole("alert");
          expect(alert).toHaveTextContent("Server Error");
        });
      });
    });
  });
});
