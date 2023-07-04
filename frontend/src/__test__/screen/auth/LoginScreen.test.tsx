import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { App } from "../../../App";
import { LoginScreen } from "../../../screens/auth/LoginScreen";
import { createServer } from "../../testUtils";
import { UserData } from "../../../../../backend/__test__/testData";
import { rest } from "msw";

const server = createServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderLoginScreen = () => {
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

describe("Login Screen", () => {
  it("displays the user's name in the header after a successful login", async () => {
    renderLoginScreen();

    await fillForm(UserData.email, UserData.password);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(
      await screen.findByText("Successfully logged in")
    ).toBeInTheDocument();

    await waitFor(async () => {
      expect(screen.getByTestId("user-info-name")).toHaveTextContent(
        UserData.name
      );
    });
  });

  it("allows the user to toggle the logout menu after a successful login", async () => {
    renderLoginScreen();

    await fillForm(UserData.email, UserData.password);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(
      await screen.findByText("Successfully logged in")
    ).toBeInTheDocument();

    await waitFor(async () => {
      expect(screen.getByTestId("user-info-name")).toHaveTextContent(
        UserData.name
      );
    });

    fireEvent.click(screen.getByText(UserData.name));
    expect(screen.getByRole("menuitem", { name: "Logout" })).toBeVisible();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menuitem", { name: "Logout" })).toBeNull();
  });

  it("displays an error message when the login attempt fails", async () => {
    renderLoginScreen();

    server.use(
      rest.post("http://localhost:8080/api/users/login", (_req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ message: "Invalid email or password" })
        );
      })
    );

    await fillForm(UserData.email, "12345");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(
      await screen.findByText("Invalid email or password")
    ).toBeInTheDocument();
  });

  it("displays an error message when the server cannot be reached", async () => {
    renderLoginScreen();

    server.use(
      rest.post("http://localhost:8080/api/users/login", (_req, res, _ctx) => {
        return res.networkError("Failed to connect");
      })
    );

    await fillForm(UserData.email, UserData.password);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(
      await screen.findByText(
        "Unable to connect to the server. Please try again."
      )
    ).toBeInTheDocument();
  });
});
