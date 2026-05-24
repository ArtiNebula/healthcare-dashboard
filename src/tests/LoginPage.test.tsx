import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import { LoginPage } from "../app/pages/LoginPage";
import * as api from "../app/services/api";

vi.mock("../app/services/api", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders email and password inputs", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders Sign In button", () => {
    renderLogin();
    // Use anchored regex to avoid matching "Sign in with Google"
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("renders link to signup page", () => {
    renderLogin();
    expect(screen.getByRole("link", { name: /sign up for free/i })).toBeInTheDocument();
  });

  it("shows error message on failed login", async () => {
    vi.mocked(api.authApi.login).mockRejectedValueOnce(new Error("Invalid email or password"));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "bad@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("navigates to /user on successful patient login", async () => {
    vi.mocked(api.authApi.login).mockResolvedValueOnce({
      success: true,
      user: { id: 1, name: "Test", email: "test@test.com", role: "patient" },
      redirectTo: "/user",
    });
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/user");
    });
  });

  it("shows loading state while submitting", async () => {
    vi.mocked(api.authApi.login).mockImplementation(() => new Promise(() => {}));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
    });
  });
});
