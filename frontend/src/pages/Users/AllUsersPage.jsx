import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUsers } from "../../services/users";
import LogoutButton from "../../components/LogoutButton";

export function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      getUsers(token)
        .then((data) => {
          setUsers(data.users);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setLoading(false);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">Loading Users...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">All Users</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-12 h-12 rounded-full" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-zinc-100 truncate">
                  {user.username || 'No username'}
                </h3>
                <p className="text-sm text-zinc-400 truncate">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link 
                to={`/user/${user._id}`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
              >
                View Profile
              </Link>
              
              {user.bio && (
                <p className="text-sm text-zinc-300 line-clamp-2">{user.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <LogoutButton />
    </div>
  );
}
