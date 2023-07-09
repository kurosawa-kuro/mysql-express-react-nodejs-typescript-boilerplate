// frontend\src\screens\product\HomeScreen.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
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

const server = setupServer(
  rest.post("http://localhost:8080/api/upload", (_req, res, ctx) => {
    return res(ctx.json(uploadImageResponse));
  }),
  rest.put("http://localhost:8080/api/users/profile", (_req, res, ctx) => {
    return res(ctx.json(userProfileResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderScreen = () => {
  render(
    <MemoryRouter initialEntries={["/profile"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

const setup = async () => {
  renderScreen();
  await simulateLogin();
};

describe("ProfileScreen", () => {
  it("renders the ProfileScreen and updates profile fields", async () => {
    await setup();

    await screen.findByRole("heading", { name: /User Profile/i });

    const nameInputElement = screen.getByPlaceholderText(
      "Enter name"
    ) as HTMLInputElement;
    expect(nameInputElement.value).toBe("User");

    fireEvent.change(nameInputElement, { target: { value: "new Name" } });
    expect(nameInputElement.value).toBe("new Name");

    const emailInputElement = screen.getByPlaceholderText(
      "Enter email"
    ) as HTMLInputElement;
    expect(emailInputElement.value).toBe("user@email.com");

    fireEvent.change(emailInputElement, {
      target: { value: "new email address" },
    });
    expect(emailInputElement.value).toBe("new email address");

    const imageInputElement = screen.getByPlaceholderText(
      "Enter image url"
    ) as HTMLInputElement;
    expect(imageInputElement.value).toBe("");

    fireEvent.change(imageInputElement, {
      target: { value: "new image url" },
    });
    expect(imageInputElement.value).toBe("new image url");

    const passwordInputElement = screen.getByPlaceholderText(
      "Enter password"
    ) as HTMLInputElement;
    expect(passwordInputElement.value).toBe("");

    fireEvent.change(passwordInputElement, {
      target: { value: "new password" },
    });
    expect(passwordInputElement.value).toBe("new password");

    const confirmPasswordInputElement = screen.getByPlaceholderText(
      "Confirm password"
    ) as HTMLInputElement;
    expect(confirmPasswordInputElement.value).toBe("");

    fireEvent.change(confirmPasswordInputElement, {
      target: { value: "new confirm password" },
    });
    expect(confirmPasswordInputElement.value).toBe("new confirm password");
  });

  it("uploads a new profile image and updates profile successfully", async () => {
    await setup();

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

    const [uploadMessage, imageInput] = await Promise.all([
      screen.findByText(uploadImageResponse.message),
      screen.findByDisplayValue(uploadImageResponse.image),
    ]);

    expect(uploadMessage).toBeInTheDocument();
    expect(imageInput).toBeInTheDocument();

    const updateButton = await screen.findByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);

    const [updateMessage, updatedNameInput, updatedEmailInput] =
      await Promise.all([
        screen.findByText("Profile updated successfully"),
        screen.findByDisplayValue(userProfileResponse.name),
        screen.findByDisplayValue(userProfileResponse.email),
      ]);

    expect(updateMessage).toBeInTheDocument();
    expect(updatedNameInput).toBeInTheDocument();
    expect(updatedEmailInput).toBeInTheDocument();
  });
});
