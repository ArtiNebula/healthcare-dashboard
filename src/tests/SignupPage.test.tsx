import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import { SignupPage } from "../app/pages/SignupPage";
import * as api from "../app/services/api";

vi.mock("../app/services/api", () => ({
  authApi: {
    signup: vi.fn(),
  },
}));

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderSignup() {
  return render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>
  );
}

function fillForm(name = "Test User", email = "test@test.com", password = "password123") {
  fireEvent.change(screen.getByPlaceholderText("John Doe"), { target: { value: name } });
  fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: password } });
  fireEvent.click(screen.getByRole("checkbox"));
}

describe("SignupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders name, email and password inputs", () => {
    renderSignup();
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders create account button", () => {
    renderSignup();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders link to login page", () => {
    renderSignup();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows error when password is less than 8 characters", async () => {
    renderSignup();
    fireEvent.change(screen.getByPlaceholderText("John Doe"), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
    expect(api.authApi.signup).not.toHaveBeenCalled();
  });

  it("shows error on API failure", async () => {
    vi.mocked(api.authApi.signup).mockRejectedValueOnce(new Error("Email already registered"));
    renderSignup();

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already registered")).toBeInTheDocument();
    });
  });

  it("navigates to /login on successful signup", async () => {
    vi.mocked(api.authApi.signup).mockResolvedValueOnce({ success: true, message: "ok" });
    renderSignup();

    fillForm("New User", "new@test.com", "password123");
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
