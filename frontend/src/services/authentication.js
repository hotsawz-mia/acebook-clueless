const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function login(email, password) {
  const payload = { email, password };

  const response = await fetch(`${BACKEND_URL}/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.status === 201) {
    const data = await response.json();
    console.log("LOGIN RESPONSE:", data);
    return data.token;                    // keep returning token for now
    // return { token: data.token, user: data.user };
  } else {
    throw new Error(
      `Received status ${response.status} when logging in. Expected 201`
    );
  }
}

export async function signup(email, password, username) {
  const response = await fetch(`${BACKEND_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });
  if (response.status !== 201) {
    throw new Error(`Received status ${response.status} when signing up. Expected 201`);
  }
}