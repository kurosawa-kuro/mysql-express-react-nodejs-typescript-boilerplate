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

    // Confirm password
    const confirmPasswordInputElement = screen.getByPlaceholderText(
      "Confirm password"
    ) as HTMLInputElement;
    expect(confirmPasswordInputElement.value).toBe("");

    fireEvent.change(confirmPasswordInputElement, {
      target: { value: "new confirm password" },
    });
    expect(confirmPasswordInputElement.value).toBe("new confirm password");
  });
});
