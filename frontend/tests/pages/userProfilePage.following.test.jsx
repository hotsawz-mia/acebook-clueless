import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../src/services/users", () => ({
  getUserById: vi.fn(),
  getFollowing: vi.fn(),
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
  updateUser: vi.fn(),
}));
import { getUserById, getFollowing } from "../../src/services/users";

const router = vi.hoisted(() => ({ useParams: vi.fn(), navigateMock: vi.fn() }));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  const Link = ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>;
  return { ...actual, useParams: router.useParams, useNavigate: () => router.navigateMock, Link };
});

import { UserProfilePage } from "../../src/pages/Profile/UserProfilePage";

describe("UserProfilePage following section", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", "tkn");
    localStorage.setItem("userId", "ME_ID");
    router.useParams.mockReturnValue({ userId: "ME_ID" });
    getUserById.mockResolvedValue({ user: { _id: "ME_ID", username: "me", email: "me@gmn" } });
  });

  test("renders Following list with items", async () => {
    getFollowing.mockResolvedValue({
      users: [{ _id: "U2", username: "Beth", email: "beth@gmn", createdAt: "2025-08-01T00:00:00Z" }],
    });

    render(<UserProfilePage />);

    // header
    await screen.findByRole("heading", { name: /^Following$/i });
    // item
    await screen.findByText("Beth");
  });

  test("renders empty state when none", async () => {
    getFollowing.mockResolvedValue({ users: [] });

    render(<UserProfilePage />);

    await screen.findByRole("heading", { name: /^Following$/i });
    await screen.findByText(/Not following anyone yet/i);
  });
});