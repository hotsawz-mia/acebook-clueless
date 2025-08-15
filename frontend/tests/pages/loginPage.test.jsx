import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { login } from "../../src/services/authentication";

import { LoginPage } from "../../src/pages/Login/LoginPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the login service
vi.mock("../../src/services/authentication", () => {
  const loginMock = vi.fn();
  return { login: loginMock };
});

// Reusable function for filling out login form
async function completeLoginForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText(/Email/i);
  const passwordInputEl = screen.getByLabelText(/Password/i);
  const submitButtonEl = screen.getByRole("button", { name: /sign in/i });

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl);
}

describe("Login Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to login", async () => {
    render(<LoginPage />);

    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "1234");
  });

  test("navigates to /posts on successful login", async () => {
    render(<LoginPage />);

    login.mockResolvedValue("secrettoken123");
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/posts");
  });

  test("navigates to /login on unsuccessful login", async () => {
    render(<LoginPage />);

    login.mockRejectedValue(new Error("Error logging in"));
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});


vi.mock("../../src/services/users", () => ({
  getUserById: vi.fn(() => Promise.resolve({ user: { _id: "ME_ID" } })),
}));
  
  // Ensure authentication mock still returns a token
  // and assert navigate("/posts") after form submit.