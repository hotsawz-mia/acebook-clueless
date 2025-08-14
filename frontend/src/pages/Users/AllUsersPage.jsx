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
        .then((data) => { setUsers(data.users); setLoading(false); })
        .catch((err) => { console.error("Error fetching users:", err); setLoading(false); navigate("/login"); });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">Loading Users...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">All Users</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user._id} className="card p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-xl">👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-menace-cream truncate">{user.username || 'No username'}</h3>
                  <p className="text-sm text-menace-cream/70 truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link to={`/user/${user._id}`} className="btn-primary w-full text-center">View Profile</Link>
                {user.bio && (
                  <p className="text-sm text-menace-cream/90 line-clamp-2">{user.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
