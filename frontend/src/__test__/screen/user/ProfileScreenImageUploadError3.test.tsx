// frontend\src\screens\product\HomeScreen.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { ProfileScreen } from "../../../screens/user/ProfileScreen";

const userProfileResponse = {
  name: "new name",
  email: "new Email Address",
  avatarPath: "url-to-your-image",
  isAdmin: false,
};

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  // Todo
  uploadImage: jest.fn(() => Promise.reject(new Error("Test error message"))),
}));

const server = setupServer(
  rest.put("http://localhost:8080/api/users/profile", (_req, res, ctx) => {
    return res(ctx.json(userProfileResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ProfileScreen", () => {
  it("renders the ProfileScreen and displays the API status when API request is successful", async () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await simulateLogin();
    await screen.findByRole("heading", { name: /User Profile/i });

    const [nameInput, emailInput] = await Promise.all([
      screen.findByDisplayValue("User"),
      screen.findByDisplayValue("user@email.com"),
    ]);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const inputFile = screen.getByLabelText("Image File") as HTMLInputElement;
    userEvent.upload(inputFile, file);

    await waitFor(() =>
      expect(screen.getByText("Test error message")).toBeInTheDocument()
    );
  });
});
