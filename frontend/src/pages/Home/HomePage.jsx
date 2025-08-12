import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Acebook!</h1>
      <div className="flex flex-col gap-4">
        <Link
          to="/signup"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}