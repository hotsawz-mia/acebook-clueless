import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getPosts } from "../../src/services/posts";
import { useNavigate } from "react-router-dom";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn();
  return { getPosts: getPostsMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("It displays newest posts first from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    // added mock posts
    const mockPosts = [
      
      { _id: "1", createdAt: "2025-08-13T12:00:00Z", content: "Newest post" },
      { _id: "2", createdAt: "2025-08-13T11:00:00Z", content: "Middle post" },
      { _id: "3", createdAt: "2025-08-13T10:00:00Z", content: "Oldest post" },

    ];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<FeedPage />);

    // const posts = await screen.findAllByRole("article");

    // // added new variables
    // const expectedDate0 = new Date(mockPosts[0].createdAt).toLocaleString();
    // const expectedDate1 = new Date(mockPosts[1].createdAt).toLocaleString();
    // // added new methods
    // expect(posts[0].textContent).toEqual(`Posted at: ${expectedDate0}`);
    // expect(posts[1].textContent).toEqual(`Posted at: ${expectedDate1}`);
    const dates = await screen.findAllByTestId("post-date");
    const expectedDate0 = new Date(mockPosts[0].createdAt).toLocaleString();
    const expectedDate1 = new Date(mockPosts[1].createdAt).toLocaleString();
    expect(dates[0].textContent).toBe(`Posted at: ${expectedDate0}`);
    expect(dates[1].textContent).toBe(`Posted at: ${expectedDate1}`);
  });

  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

});



