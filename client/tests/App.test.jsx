import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

test("renders login component", () => {
  render(<App />);
  const loginElement = screen.getByText(/Login/i);
  expect(loginElement).toBeInTheDocument();
});
