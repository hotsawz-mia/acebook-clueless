import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// --- services mock ---
vi.mock("../../src/services/users", () => ({
  getUserById: vi.fn(),
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
  updateUser: vi.fn(),
}));
import { getUserById, followUser, unfollowUser, updateUser } from "../../src/services/users";

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

describe("UserProfilePage edit profile", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", "tkn");
    localStorage.setItem("userId", "ME_ID");

    router.useParams.mockReturnValue({ userId: "ME_ID" });

    getUserById.mockImplementation((id) => {
      if (id === "me" || id === "ME_ID") {
        return Promise.resolve({
          user: { _id: "ME_ID", username: "OldName", email: "me@example.com" },
        });
      }
      return Promise.reject(new Error("unexpected id"));
    });
  });

  test("updates username and shows new value", async () => {
    const user = userEvent.setup();
  
    // mock initial profile
    getUserById.mockResolvedValue({
      user: { _id: "ME_ID", username: "OldName", email: "me@example.com" },
    });
  
    // mock following if your component calls it
    // getFollowing.mockResolvedValue({ users: [] });
  
    // mock the PUT /users/me fetch the component now uses
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        user: { _id: "ME_ID", username: "NewName", email: "me@example.com" },
      }),
    });
  
    render(<UserProfilePage />);
  
    const editBtn = await screen.findByRole('button', { name: /edit profile/i });
    await user.click(editBtn);
  
    const input = await screen.findByDisplayValue("OldName");
    await user.clear(input);
    await user.type(input, "NewName");
  
    const saveBtn = screen.getByRole("button", { name: /^save$/i });
    await user.click(saveBtn);
  
    // assert UI result
    expect(await screen.findByText("NewName")).toBeTruthy();
  
    // optional: assert the network call
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/users\/me$/),
      expect.objectContaining({ method: "PUT" })
    );
  });
});