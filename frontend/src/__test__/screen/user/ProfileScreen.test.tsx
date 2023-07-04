// frontend\src\screens\product\HomeScreen.test.tsx

import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { printDOM, simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { ProfileScreen } from "../../../screens/user/ProfileScreen";
// import { ProfileScreen } from "../../../services/api";

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
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ProfileScreen", () => {
  it("renders the ProfileScreen and displays the API status when API request is successful", async () => {
    // const { uploadProductImage } = require("../../../services/api");
    // const mockUpload = uploadProductImage as jest.MockedFunction<
    //   typeof uploadProductImage
    // >;
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

    // User Profile
    await screen.findByRole("heading", { name: /User Profile/i });

    const nameInput = await screen.findByDisplayValue("User");
    expect(nameInput).toBeInTheDocument();

    const emailInput = await screen.findByDisplayValue("user@email.com");
    expect(emailInput).toBeInTheDocument();

    const file = new File(["dummy content"], "test.png", {
      type: "image/png",
    });

    const input = screen.getByLabelText("Image File") as HTMLInputElement;
    userEvent.upload(input, file);

    // await waitFor(() => expect(mockUpload).toHaveBeenCalledTimes(1));
    expect(
      await screen.findByText("Image uploaded successfully")
    ).toBeInTheDocument();

    printDOM();
  });
});
