const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// const RAW = import.meta.env.VITE_BACKEND_URL;
// if (!RAW) {
//   throw new Error("VITE_BACKEND_URL is not set. Create the .env at your Vite project root and restart.");
// }
// const BACKEND_URL = RAW.replace(/\/+$/, "");

export async function login(email, password) {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    let data = await response.json();
    return data.token;
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


// export async function signup(email, password) {
//   const payload = { email, password };

//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   };

//   const response = await fetch(`${BACKEND_URL}/users`, requestOptions);

//   if (!response.ok) {
//     // Get the full error text from the server so we can debug
//     const text = await response.text().catch(() => "");
//     throw new Error(text || `Received status ${response.status} when signing up. Expected 201`);
//   }

//   // 201 = created, nothing else to do here
//   return;
// }

// export async function signup(email, password) {
//   const payload = {
//     email: email,
//     password: password,
//   };

//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   };

//   let response = await fetch(`${BACKEND_URL}/users`, requestOptions);

//   // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
//   if (response.status === 201) {
//     return;
//   } else {
//     throw new Error(
//       `Received status ${response.status} when signing up. Expected 201`
//     );
//   }
// }
