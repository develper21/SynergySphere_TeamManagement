import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SignIn from "@/pages/SignIn";

const { mutateMock, useLoginMock } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  useLoginMock: vi.fn(),
}));

vi.mock("@/hooks/api/useAuth", () => ({
  useLogin: useLoginMock,
}));

const renderSignIn = () =>
  render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>
  );

describe("SignIn", () => {
  beforeEach(() => {
    mutateMock.mockReset();
    useLoginMock.mockReturnValue({ mutate: mutateMock, isPending: false });
  });

  it("renders the sign-in form and account links", () => {
    renderSignIn();

    expect(screen.getByRole("heading", { name: "Welcome Back" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeRequired();
    expect(screen.getByPlaceholderText("••••••••")).toBeRequired();
    expect(screen.getByRole("link", { name: "Forgot Password?" })).toHaveAttribute(
      "href",
      "/forgot-password"
    );
    expect(screen.getByRole("link", { name: "Sign Up" })).toHaveAttribute("href", "/signup");
  });

  it("submits the entered email and password", () => {
    renderSignIn();

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "member@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "correct-horse" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mutateMock).toHaveBeenCalledWith(
      { email: "member@example.com", password: "correct-horse" },
      expect.objectContaining({ onError: expect.any(Function) })
    );
  });

  it("disables submission while a login request is pending", () => {
    useLoginMock.mockReturnValue({ mutate: mutateMock, isPending: true });
    renderSignIn();

    const submitButton = screen
      .getAllByRole("button")
      .find((button) => button.getAttribute("type") === "submit");

    expect(submitButton).toBeDisabled();
  });
});
