import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders scheduling tabs", () => {
  render(<App />);
  expect(screen.getByRole("region", { name: /Scheduling/i })).toBeInTheDocument();
  // Tabs should be visible
  expect(screen.getByRole("tab", { name: /Manage Availability/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /Schedule ICU/i })).toBeInTheDocument();
});
