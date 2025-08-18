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
