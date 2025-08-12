import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import User from "../../components/User";
import LogoutButton from "../../components/LogoutButton";
import { getUserById } from "../../services/users";

export function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params




  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token found:", !!token); // Debug: log if token exists
    
    if (token) {
      setLoading(true);
      // If no userId in URL, use "me" or get current user
      const targetUserId = userId || "me";
      console.log("Fetching user with ID:", targetUserId); // Debug: log target user ID
      
      getUserById(targetUserId, token)
        .then((data) => {
          console.log("User data received:", data); // Debug: log response
          setUser(data.user);
          // localStorage.setItem("token", data.token);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user:", err); // Better error logging
          setLoading(false);
          
          // Check if it's a 404 (user not found) vs other errors
          if (err.message.includes("404") || err.message.includes("User not found")) {
            // User doesn't exist, don't redirect to login
            setUser(null); // This will show "User Not Found" message
          } else {
            // Authentication or other error, redirect to login
            navigate("/login");
          }
        });
    } else {
      console.log("No token found, redirecting to login"); // Debug: log redirect reason
      navigate("/login");
    }
  }, [navigate, userId]);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  // Show user not found
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">User Not Found</h2>
        <p>Sorry, we couldn't find that user.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">{user.username || user.email}'s Profile</h2>
      <div className="space-y-4">
        <User user={user} />
      </div>
      <LogoutButton />
    </div>
  );
}