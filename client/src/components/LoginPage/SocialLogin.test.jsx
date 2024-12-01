import React from "react";
import { render, screen } from "@testing-library/react";
import SocialLogin from "./SocialLogin";

describe("SocialLogin Component", () => {
  test("renders SocialLogin component", () => {
    render(<SocialLogin />);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
  });

  test("button contains correct text", () => {
    render(<SocialLogin />);
    const buttonText = screen.getByText(/Login with Google/i);
    expect(buttonText).toBeInTheDocument();
  });

  test("image has correct src and alt attributes", () => {
    render(<SocialLogin />);
    const imgElement = screen.getByRole("presentation");
    expect(imgElement).toHaveAttribute("src", "google.png");
    expect(imgElement).toHaveAttribute("alt", "");
  });
});