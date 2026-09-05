import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the login page first", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /sign in to inventory/i }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
});
