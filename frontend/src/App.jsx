import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";

import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";

import { CreatePostPage } from "./pages/Create_Post/CreatePostPage";

import { UserProfilePage } from "./pages/Profile/UserProfilePage";
import { AllUsersPage } from "./pages/Users/AllUsersPage";


const router = createBrowserRouter([
  {
    element: <RootLayout />, // 👈 wrap all pages in RootLayout
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/posts", element: <FeedPage /> },
      { path: "/users", element: <AllUsersPage /> }, // Add this line
      { path: "/user/:userId", element: <UserProfilePage /> }, // userId parameter
      { path: "/profile", element: <UserProfilePage /> }, // current user route
    ],
  },
    {
    path: "/create-post",
    element: <CreatePostPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}