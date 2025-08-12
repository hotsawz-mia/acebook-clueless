import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";

import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />, // 👈 wrap all pages in RootLayout
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/posts", element: <FeedPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}