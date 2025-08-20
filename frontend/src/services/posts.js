// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getPosts(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}

/**
 * Creates a post.
 * If `data` is a FormData instance, send it directly (for photo upload).
 * Otherwise, treat `data` as message string and send JSON.
 *
 * @param {string|FormData} data - Message string or FormData with message + photo
 * @param {string} token - Authorization token
 */
export async function createPost(data, token) {
  let options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (data instanceof FormData) {
    options.body = data;
    // Don't set Content-Type with FormData — browser sets it automatically
  } else {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify({ message: data });
  }

  const response = await fetch(`${BACKEND_URL}/posts`, options);

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
}


/**
 * Fetches ONLY the posts authored by a specific user.
 * WHY: Profile page should not load the global feed and filter client-side.
 *      This hits GET /users/:userId/posts on our API.
 */
export async function getUserPosts(userId, token) {
  // Send auth so the API returns 200 instead of 401
  const opts = { method: "GET", headers: { Authorization: `Bearer ${token}` } };

  // Target the backend route you built in Express
  const res = await fetch(`${BACKEND_URL}/users/${userId}/posts`, opts);

  // Fail fast on non-OK so the page can redirect on 401, etc.
  if (!res.ok) {
    // Propagate the status for tests/handlers to branch on (e.g., 401 → login)
    const err = new Error("Failed to fetch user posts");
    err.status = res.status;
    throw err;
  }

  // Shape: { posts: [...] }
  return res.json();
}