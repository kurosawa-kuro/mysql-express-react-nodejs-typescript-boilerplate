import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { App } from "../../App";
import { LoginScreen } from "../../screens/auth/LoginScreen";
import { createServer, printDOM, simulateLogin } from "../testUtils";
import { UserData } from "../../../../backend/__test__/testData";

const server = createServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Define helper functions for repeated operations
const renderLoginScreen = () => {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("App Screen", () => {
  it("shows username in header after successful login for logout", async () => {
    renderLoginScreen();

    await simulateLogin();

    await waitFor(async () => {
      expect(screen.getByTestId("user-info-name")).toHaveTextContent(
        UserData.name
      );
    });

    fireEvent.click(await screen.findByText(`User`));
    fireEvent.click(await screen.findByText(`Logout`));
    printDOM();
  });
});
