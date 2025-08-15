import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// --- services mock ---
vi.mock("../../src/services/users", () => ({
  getUserById: vi.fn(),
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
}));
import { getUserById, followUser, unfollowUser } from "../../src/services/users";

// --- router mock with hoisted fns to avoid init order errors ---
const router = vi.hoisted(() => ({
  useParams: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  // keep real exports except the ones we override
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: router.useParams,
    useNavigate: () => router.navigateMock,
  };
});

// import after mocks
import { UserProfilePage } from "../../src/pages/Profile/UserProfilePage";

describe("UserProfilePage follow/unfollow", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", "tkn");
    localStorage.setItem("userId", "ME_ID");
  });

  test("shows Follow when viewing someone else", async () => {
    router.useParams.mockReturnValue({ userId: "TARGET_ID" });

    getUserById.mockImplementation((id) => {
      if (id === "TARGET_ID") {
        return Promise.resolve({ user: { _id: "TARGET_ID", username: "Target" } });
      }
      if (id === "me") {
        return Promise.resolve({ user: { _id: "ME_ID", following: [] } });
      }
      return Promise.reject(new Error("unexpected id"));
    });

    render(<UserProfilePage />);

    const btn = await screen.findByRole("button", { name: /follow/i });
    expect(btn).toBeTruthy();
  });

  test("clicking Follow calls API and toggles", async () => {
    router.useParams.mockReturnValue({ userId: "TARGET_ID" });

    getUserById.mockImplementation((id) => {
      if (id === "TARGET_ID") {
        return Promise.resolve({ user: { _id: "TARGET_ID", username: "Target" } });
      }
      if (id === "me") {
        return Promise.resolve({ user: { _id: "ME_ID", following: [] } });
      }
      return Promise.reject(new Error("unexpected id"));
    });
    followUser.mockResolvedValue({ ok: true });

    const user = userEvent.setup();
    render(<UserProfilePage />);

    const followBtn = await screen.findByRole("button", { name: /follow/i });
    await user.click(followBtn);

    expect(followUser).toHaveBeenCalledWith("TARGET_ID", "tkn");
    const unfollowBtn = await screen.findByRole("button", { name: /unfollow/i });
    expect(unfollowBtn).toBeTruthy();
  });

  test("hides button on own profile", async () => {
    router.useParams.mockReturnValue({ userId: "ME_ID" });
    getUserById.mockResolvedValue({ user: { _id: "ME_ID", username: "Me" } });

    render(<UserProfilePage />);

    expect(screen.queryByRole("button", { name: /follow/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /unfollow/i })).toBeNull();
  });
});