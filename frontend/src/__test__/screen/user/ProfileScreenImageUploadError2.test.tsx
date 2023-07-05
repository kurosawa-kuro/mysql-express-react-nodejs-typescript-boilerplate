// frontend\src\screens\product\HomeScreen.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
// import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { ProfileScreen } from "../../../screens/user/ProfileScreen";

const uploadImageResponse = {
  image: "url-to-your-image",
  message: "Image uploaded successfully",
};

const userProfileResponse = {
  name: "new name",
  email: "new Email Address",
  avatarPath: "url-to-your-image",
  isAdmin: false,
};

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  uploadImage: jest.fn(() => Promise.resolve(uploadImageResponse)),
}));

const server = setupServer(
  rest.put("http://localhost:8080/api/users/profile", (_req, res, ctx) => {
    return res(ctx.json(userProfileResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  updateUserProfile: jest.fn(() =>
    Promise.reject(new Error("Test error message"))
  ),
}));

// Test case
it("displays an error message when the API request fails", async () => {
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

  const passwordInputElement = screen.getByPlaceholderText(
    "Enter password"
  ) as HTMLInputElement;
  fireEvent.change(passwordInputElement, { target: { value: "password" } });

  const confirmPasswordInputElement = screen.getByPlaceholderText(
    "Confirm password"
  ) as HTMLInputElement;
  fireEvent.change(confirmPasswordInputElement, {
    target: { value: "password" },
  });

  const updateButton = await screen.findByRole("button", { name: /Update/i });
  fireEvent.click(updateButton);

  // Verify that the error toast is displayed
  await waitFor(() =>
    expect(screen.getByText("Test error message")).toBeInTheDocument()
  );
});
