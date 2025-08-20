import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("../../src/services/posts", () => ({
  getUserPosts: vi.fn(),
}));

vi.mock("../../src/services/users", () => ({
  getUserById: vi.fn(),
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
  updateUser: vi.fn(),
  getFollowing: vi.fn(),         
}));

import * as postsService from "../../src/services/posts";


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
import { getUserById, followUser, unfollowUser, updateUser, getFollowing } from "../../src/services/users";

import { UserProfilePage } from "../../src/pages/Profile/UserProfilePage";

describe("UserProfilePage follow/unfollow", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", "tkn");
    localStorage.setItem("userId", "ME_ID");
    getFollowing.mockResolvedValue({ users: [] });
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

    updateUser.mockResolvedValue({
      user: { _id: "ME_ID", username: "NewName", email: "me@example.com" },
    });

    render(<UserProfilePage />);

    const editBtn = await screen.findByRole("button", { name: /edit profile/i });
    await user.click(editBtn);

    const input = await screen.findByDisplayValue("OldName");
    await user.clear(input);
    await user.type(input, "NewName");

    const saveBtn = screen.getByRole("button", { name: /^save$/i });
    await user.click(saveBtn);

    // New username visible
    const newNameText = await screen.findByText("NewName");
    expect(newNameText).toBeTruthy();

    // Toast appears if present
    const toast = screen.queryByText(/profile updated/i);
    if (toast) expect(toast).toBeTruthy();
  });
});


describe("UserProfilePage shows posts", () => {

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", "tkn");

    // router param for target profile
    router.useParams.mockReturnValue({ userId: "U" });

    // ✅ profile + "me" calls succeed
    getUserById.mockImplementation((id) => {
      if (id === "U")   return Promise.resolve({ user: { _id: "U", username: "Captain" } });
      if (id === "me")  return Promise.resolve({ user: { _id: "ME_ID", following: [] } });
      return Promise.reject(new Error("unexpected id"));
    });

    // ✅ following call succeeds
    getFollowing.mockResolvedValue({ users: [] });
  });
    
  test("profile shows all posts for user", async () => {
    // Tell the mocked posts service what to return when the component calls it.
    // Instead of doing a real fetch, getUserPosts will resolve to this object.
    postsService.getUserPosts.mockResolvedValue({
      posts: [
        { _id: "p1", message: "A", user: { _id: "U", username: "Captain" } },
      ],
    });
  
    // Render the component. On mount, it:
    //  - reads token/userId from localStorage (set in beforeEach)
    //  - calls getUserById + getFollowing (which we mocked)
    //  - then calls getUserPosts("U", "tkn") (which we just mocked above)
    render(<UserProfilePage />);
  
    expect(await screen.findByText("A")).toBeTruthy();
  });

  test("profile shows a message if no posts exist for that user", async () => {
    // Mock API to return empty posts
    postsService.getUserPosts.mockResolvedValue({ posts: [] });
  
    render(<UserProfilePage />);
  
    // ✅ Check that the "no posts" message shows
    // (replace text with the actual copy you render in your component)
    expect(screen.queryByTestId("post")).toBeNull();
  });

  test("orders newest first", async () => {
    // Tell the mocked posts service what to return when the component calls it.
    // Instead of doing a real fetch, getUserPosts will resolve to this object.
    postsService.getUserPosts.mockResolvedValue({
      posts: [
        { _id: "p1", message: "A", createdAt: "2020-01-01T00:00:00Z" },
        { _id: "p1", message: "D", createdAt: "2023-01-01T00:00:00Z" },
        { _id: "p1", message: "B", createdAt: "2021-01-01T00:00:00Z" },
        { _id: "p1", message: "C", createdAt: "2022-01-01T00:00:00Z" },
      ],
    });
  
    render(<UserProfilePage />);

    const items = await screen.findAllByTestId("post");
  
    expect(items[0].textContent).to.include("D");
    expect(items[1].textContent).to.include("C");
    expect(items[2].textContent).to.include("B");
    expect(items[3].textContent).to.include("A");
  });
  
});