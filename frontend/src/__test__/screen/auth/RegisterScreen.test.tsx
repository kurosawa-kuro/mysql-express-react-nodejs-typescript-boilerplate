import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { App } from "../../../App";
import { RegisterScreen } from "../../../screens/auth/RegisterScreen";
import { createServer } from "../../testUtils";
import { UserData } from "../../../../../backend/__test__/testData";
import { rest } from "msw";

const server = createServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderScreen = () => {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/register" element={<RegisterScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

const fillForm = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  fireEvent.change(screen.getByTestId("input-name"), {
    target: { value: name },
  });

  fireEvent.change(screen.getByTestId("input-email"), {
    target: { value: email },
  });

  fireEvent.change(screen.getByTestId("input-password"), {
    target: { value: password },
  });

  fireEvent.change(screen.getByTestId("input-confirmPassword"), {
    target: { value: confirmPassword },
  });

  fireEvent.click(screen.getByTestId("register"));
};

describe("Registration Screen", () => {
  it("should show username in header after successful registration", async () => {
    renderScreen();

    await fillForm(
      UserData.name,
      UserData.email,
      UserData.password,
      UserData.password
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(
      await screen.findByText("Registration successful")
    ).toBeInTheDocument();

    await waitFor(async () => {
      expect(screen.getByTestId("user-info-name")).toHaveTextContent(
        UserData.name
      );
    });
  });

  it("should show an error message when password confirmation does not match", async () => {
    renderScreen();

    await fillForm(UserData.name, UserData.email, UserData.password, "12345");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("displays a network error message when the server is unreachable", async () => {
    renderScreen();

    server.use(
      rest.post(
        "http://localhost:8080/api/auth/register",
        (_req, res, _ctx) => {
          return res.networkError("Failed to connect");
        }
      )
    );

    await fillForm(
      UserData.name,
      UserData.email,
      UserData.password,
      UserData.password
    );

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
