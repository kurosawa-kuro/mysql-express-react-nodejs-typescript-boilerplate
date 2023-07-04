// frontend\src\screens\product\HomeScreen.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { ProfileScreen } from "../../../screens/user/ProfileScreen";

jest.mock("../../../services/api", () => ({
  ...jest.requireActual("../../../services/api"),
  uploadImage: jest.fn(() =>
    Promise.resolve({
      image: "url-to-your-image",
      message: "Image uploaded successfully",
    })
  ),
}));

const server = setupServer(
  rest.get("http://localhost:8080/api/", (_req, res, ctx) => {
    return res(ctx.text("API is running...."));
  }),
  rest.put("http://localhost:8080/api/users/profile", (_req, res, ctx) => {
    return res(
      ctx.json({
        name: "UserData.name",
        email: "UserData.email",
        avatarPath: "url-to-your-image",
        isAdmin: false,
      })
    );
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

    const nameInput = await screen.findByDisplayValue("User");
    expect(nameInput).toBeInTheDocument();

    const emailInput = await screen.findByDisplayValue("user@email.com");
    expect(emailInput).toBeInTheDocument();

    // ========
    // fireEvent.change(screen.getByLabelText("Name"), {
    //   target: { value: "new Name" },
    // });

    // fireEvent.change(screen.getByLabelText("Email Address"), {
    //   target: { value: "new Email Address" },
    // });

    // fireEvent.change(screen.getByLabelText("Password"), {
    //   target: { value: "123456" },
    // });

    // fireEvent.change(screen.getByLabelText("Confirm Password"), {
    //   target: { value: "123456" },
    // });
    // ====

    const file = new File(["dummy content"], "test.png", {
      type: "image/png",
    });

    const input = screen.getByLabelText("Image File") as HTMLInputElement;
    userEvent.upload(input, file);

    expect(
      await screen.findByText("Image uploaded successfully")
    ).toBeInTheDocument();

    const imageInput = await screen.findByDisplayValue("url-to-your-image");
    expect(imageInput).toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: /Update/i }));
    // "Profile updated successfully"
    expect(
      await screen.findByText("Profile updated successfully")
    ).toBeInTheDocument();
    expect(await screen.findByText("Update")).toBeInTheDocument();
    // printDOM();
    const emailInput2 = await screen.findByDisplayValue("UserData.email");
    expect(emailInput2).toBeInTheDocument();
    // printDOM();
  });
});
