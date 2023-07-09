import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { App } from "../../../App";
import { LoginScreen } from "../../../screens/auth/LoginScreen";
import { createServer } from "../../testUtils";
import { AdminData } from "../../../../../backend/__test__/testData";

const server = createServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderScreen = () => {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

const fillForm = async (email: string, password: string) => {
  fireEvent.change(screen.getByLabelText("email"), {
    target: { value: email },
  });

  fireEvent.change(screen.getByLabelText("password"), {
    target: { value: password },
  });

  fireEvent.click(screen.getByTestId("login"));
};

describe("Admin Login Screen", () => {
  it("shows username in header after successful admin login", async () => {
    renderScreen();

    await fillForm(AdminData.email, AdminData.password);

    await waitFor(async () => {
      expect(screen.getByTestId("user-info-name")).toHaveTextContent(
        AdminData.name
      );
    });

    fireEvent.click(await screen.findByText(`Admin Function`));
    expect(screen.getByRole("menuitem", { name: "Users" })).toBeVisible();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menuitem", { name: "Users" })).toBeNull();
  });
});
