// frontend\src\__test__\InformationScreen.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { App } from "../App";
import { InformationScreen } from "../screens/InformationScreen";

describe("Rendering InformationScreen", () => {
  it("displays the InformationScreen upon navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/information"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/information" element={<InformationScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole("heading", { name: /Information/i });
  });
});

describe("Retrieving Information Data", () => {
  it("shows Information Data when API request is successful", async () => {
    render(
      <MemoryRouter initialEntries={["/information"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/information" element={<InformationScreen />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Information Data")).toBeInTheDocument()
    );
  });
});
