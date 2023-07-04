// frontend\src\screens\admin\product\ProductNewScreenLoggedIn.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { App } from "../../../App";
import { LoginScreen } from "../../../screens/auth/LoginScreen";
import { createServer } from "../../testUtils";
import { AdminData } from "../../../../../backend/__test__/testData";

const server = createServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("shows username in header after successful admin login", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("email"), {
    target: { value: AdminData.email },
  });

  fireEvent.change(screen.getByLabelText("password"), {
    target: { value: AdminData.password },
  });

  fireEvent.click(screen.getByTestId("login"));

  await waitFor(async () => {
    expect(screen.getByTestId("user-info-name")).toHaveTextContent(
      AdminData.name
    );
  });
});

test("admin login fail", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<App />} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("email"), {
    target: { value: "admin@email.co" },
  });

  fireEvent.change(screen.getByLabelText("password"), {
    target: { value: AdminData.password },
  });

  fireEvent.click(screen.getByTestId("login"));

  await waitFor(() => {
    const johnText = screen.queryByText(AdminData.name);
    expect(johnText).not.toBeInTheDocument();
  });
});
