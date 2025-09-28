import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

test("renders scheduling tabs", () => {
  render(
    <MemoryRouter initialEntries={["/schedule"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole("region", { name: /Scheduling/i })).toBeInTheDocument();
  // Tabs should be visible
  expect(screen.getByRole("tab", { name: /Manage Availability/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /Schedule ICU/i })).toBeInTheDocument();
});
