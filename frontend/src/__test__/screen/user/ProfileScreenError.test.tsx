import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { ProfileScreen } from "../../../screens/user/ProfileScreen";
import userEvent from "@testing-library/user-event";

const userProfile = {
  name: "new name",
  email: "new Email Address",
  avatarPath: "url-to-your-image",
  isAdmin: false,
};

function renderScreen() {
  render(
    <MemoryRouter initialEntries={["/profile"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const setup = async () => {
  renderScreen();
  await simulateLogin();
};

const server = setupServer(
  rest.put("http://localhost:8080/api/users/profile", (_req, res, ctx) => {
    return res(ctx.json(userProfile));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ProfileScreen ", () => {
  it("validates password mismatch during profile update", async () => {
    await setup();

    await screen.findByRole("heading", { name: /User Profile/i });

    const [nameInput, emailInput] = await Promise.all([
      screen.findByDisplayValue("User"),
      screen.findByDisplayValue("user@email.com"),
    ]);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(
      "Enter password"
    ) as HTMLInputElement;
    expect(passwordInput.value).toBe("");

    fireEvent.change(passwordInput, {
      target: { value: "new password" },
    });
    expect(passwordInput.value).toBe("new password");

    const confirmPassInput = screen.getByPlaceholderText(
      "Confirm password"
    ) as HTMLInputElement;
    expect(confirmPassInput.value).toBe("");

    fireEvent.change(confirmPassInput, {
      target: { value: "new confirm password" },
    });
    expect(confirmPassInput.value).toBe("new confirm password");

    const updateButton = await screen.findByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);

    const [updateMessage] = await Promise.all([
      screen.findByText("Passwords do not match"),
    ]);

    expect(updateMessage).toBeInTheDocument();
  });

  it("handles server error during image upload", async () => {
    await setup();

    await screen.findByRole("heading", { name: /User Profile/i });

    server.use(
      rest.post("http://localhost:8080/api/upload", (_req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ message: "Server error when file upload" })
        );
      })
    );

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const inputFile = screen.getByLabelText("Image File") as HTMLInputElement;
    userEvent.upload(inputFile, file);

    await waitFor(() =>
      expect(
        screen.getByText("Server error when file upload")
      ).toBeInTheDocument()
    );
  });

  it("handles server error during user profile update", async () => {
    server.use(
      rest.put("http://localhost:8080/api/users/profile", (_req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ message: "Server error when upload user's profile" })
        );
      })
    );

    await setup();

    await screen.findByRole("heading", { name: /User Profile/i });

    const passwordInput = screen.getByPlaceholderText(
      "Enter password"
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "password" } });

    const confirmPassInput = screen.getByPlaceholderText(
      "Confirm password"
    ) as HTMLInputElement;
    fireEvent.change(confirmPassInput, {
      target: { value: "password" },
    });

    const updateButton = await screen.findByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);

    await waitFor(() =>
      expect(
        screen.getByText("Server error when upload user's profile")
      ).toBeInTheDocument()
    );
  });
});
