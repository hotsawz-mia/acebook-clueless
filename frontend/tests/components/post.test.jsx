import { render, screen } from "@testing-library/react";
import Post from "../../src/components/Post";

describe("Post", () => {
  test("displays the message as an article", () => {
    const testPost = { _id: "123", message: "test message" };
    render(<Post post={testPost} />);

    expect(screen.queryByText("test message")).not.toBeNull();
  });
});

describe("Post component", () => {
  test("renders post date", () => {
    const mockPost = {
      _id: "123",
      createdAt: "2025-08-13T10:00:00Z",
    };

    render(<Post post={mockPost} />);
    const expectedDate = new Date(mockPost.createdAt).toLocaleString();
    expect(screen.getByTestId("post-date").textContent)
      .toBe(`Posted at: ${expectedDate}`);
  });

  test("renders posted by", () => {
    const mockPost = {
      _id: "123",
      createdAt: "2025-08-13T10:00:00Z",
      user: { email: "user@email.com" }
    };
  
    render(<Post post={mockPost} />);
    const article = screen.getByRole("article");
    expect(article.textContent).toContain(`Posted by: ${mockPost.user.email}`);
  });
});