// frontend\src\screens\product\HomeScreen.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { simulateLogin } from "../../testUtils";
import { App } from "../../../App";
import { ProfileScreen } from "../../../screens/user/ProfileScreen";

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

    const nameInput = screen.getByPlaceholderText(
      "Enter name"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("User");

    fireEvent.change(nameInput, { target: { value: "new Name" } });
    expect(nameInput.value).toBe("new Name");

    const emailAddressInput = screen.getByPlaceholderText(
      "Enter email"
    ) as HTMLInputElement;
    expect(emailAddressInput.value).toBe("user@email.com");

    fireEvent.change(emailAddressInput, {
      target: { value: "new email address" },
    });
    expect(emailAddressInput.value).toBe("new email address");

    const imageInput = screen.getByPlaceholderText(
      "Enter image url"
    ) as HTMLInputElement;
    expect(imageInput.value).toBe("");

    fireEvent.change(imageInput, {
      target: { value: "new image url" },
    });
    expect(imageInput.value).toBe("new image url");
  });
});
