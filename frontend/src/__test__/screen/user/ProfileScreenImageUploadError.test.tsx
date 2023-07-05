// frontend\src\screens\product\HomeScreen.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { ProfileScreen } from "../../../screens/user/ProfileScreen";
import userEvent from "@testing-library/user-event";

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

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
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

describe("ProfileScreen ", () => {
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

    // ======
    const passwordInputElement = screen.getByPlaceholderText(
      "Enter password"
    ) as HTMLInputElement;
    expect(passwordInputElement.value).toBe("");

    fireEvent.change(passwordInputElement, {
      target: { value: "new password" },
    });
    expect(passwordInputElement.value).toBe("new password");

    // Confirm password
    const confirmPasswordInputElement = screen.getByPlaceholderText(
      "Confirm password"
    ) as HTMLInputElement;
    expect(confirmPasswordInputElement.value).toBe("");

    fireEvent.change(confirmPasswordInputElement, {
      target: { value: "new confirm password" },
    });
    expect(confirmPasswordInputElement.value).toBe("new confirm password");
    // ======

    const updateButton = await screen.findByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);

    const [updateMessage] = await Promise.all([
      screen.findByText("Passwords do not match"),
    ]);

    expect(updateMessage).toBeInTheDocument();
  });

  it("updateUserProfile fail", async () => {
    // jest.mock("../../../services/api", () => ({
    //   ...jest.requireActual("../../../services/api"),
    //   updateUserProfile: jest.fn(() =>
    //     Promise.reject(new Error("Test error message"))
    //   ),
    // }));

    // server.useでrest.put("http://localhost:8080/api/users/profile"が失敗する設定
    server.use(
      rest.put("http://localhost:8080/api/users/profile", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }));
      })
    );

    // const server = setupServer(
    //   rest.put("http://localhost:8080/api/users/profile", (_req, res, ctx) => {
    //     return res(ctx.json(userProfileResponse));
    //   })
    // );
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
      expect(screen.getByText("Server error")).toBeInTheDocument()
    );
  });

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

    server.use(
      rest.post("http://localhost:8080/api/upload", (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }));
      })
    );

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const inputFile = screen.getByLabelText("Image File") as HTMLInputElement;
    userEvent.upload(inputFile, file);

    await waitFor(() =>
      expect(screen.getByText("Test error message")).toBeInTheDocument()
    );
  });
});
