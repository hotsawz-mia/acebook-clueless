// src/services/users.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUsers(token) {
  if (!token) throw new Error("No token provided");

  const res = await fetch(`${BACKEND_URL}/users`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unable to fetch users");
  return res.json();
}

export async function getUserById(userId, token) {
  if (!token) throw new Error("No token provided");

  const res = await fetch(`${BACKEND_URL}/users/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unable to fetch user");
  return res.json();
}

export async function followUser(userId, token) {
  const res = await fetch(`${BACKEND_URL}/users/${userId}/follow`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to follow user");
  return res.json();
}

export async function unfollowUser(userId, token) {
  const res = await fetch(`${BACKEND_URL}/users/${userId}/follow`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to unfollow user");
  return res.json();
}